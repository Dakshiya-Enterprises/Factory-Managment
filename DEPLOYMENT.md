# Deploying to the Windows server

This repo auto-deploys to your Windows server on every push to `main`:

```
push to main → CI workflow (GitHub cloud) type-checks + builds
             → if that passes, Deploy workflow runs ON YOUR SERVER
             → git checkout + npm ci + npm run build + pm2 restart
```

Nothing runs unless CI passes, so a broken push never takes down the live dashboard.
Everything below is a **one-time setup** on the Windows server. After that, `git push` is all you ever do.

## 1. Prerequisites on the server

Install once, in an elevated (Administrator) PowerShell:

- **Git for Windows** — https://git-scm.com/download/win
- **Node.js 20 LTS** — https://nodejs.org (adds `node`/`npm` to PATH)
- **PM2** (process manager that keeps the site running and restarts it on deploy):
  ```powershell
  npm install -g pm2
  ```
- **PM2 Windows startup** (so PM2 itself survives a server reboot):
  ```powershell
  npm install -g pm2-windows-startup
  pm2-startup install
  ```

Verify each is on PATH: `git --version`, `node -v`, `npm -v`, `pm2 -v`.

## 2. Register a self-hosted GitHub Actions runner

This lets GitHub run the deploy job directly on your server (it connects outbound to
GitHub, so no inbound firewall port is needed for this part).

1. On GitHub: **Settings → Actions → Runners → New self-hosted runner → Windows**.
2. Copy-paste the commands GitHub shows you into a PowerShell prompt on the server —
   they download the runner and register it with a one-time token tied to this repo.
3. **Install it as a Windows service** (instead of just running `run.cmd` in a console
   you have to keep open) so it keeps working after reboots and while logged out:
   ```powershell
   .\svc install
   .\svc start
   ```
4. Leave the runner's default labels as-is (`self-hosted`, `Windows`, `X64`) — the
   `deploy.yml` workflow targets `[self-hosted, Windows]`. If you ever change the
   labels, update that line in `.github/workflows/deploy.yml` to match.

   **Important:** the runner service needs `node`, `npm`, `git`, and `pm2` on its
   PATH. If you installed Node/PM2 for your own user account, either install the
   runner service to log on as that same account (Services → the runner service →
   Log On tab), or reinstall Node/PM2 so they're available system-wide.

## 3. First deploy

Push any commit to `main` (or trigger it by hand: **Actions tab → Deploy to Windows
Server → Run workflow**). Watch it run under the repo's **Actions** tab — you'll see
`CI` run first, then `Deploy to Windows Server` pick it up.

The first time `deploy.yml` runs, there's no PM2 process yet, so `scripts/deploy.ps1`
starts one:

```
pm2 serve dist 3000 --name jsw-dashboard --spa
```

Every push after that just restarts the same process. Check it's up:

```powershell
pm2 status
pm2 logs jsw-dashboard
```

Open **http://localhost:3000** on the server, or **http://<server-ip>:3000** from
another machine on the LAN (add a Windows Firewall inbound rule for TCP 3000 if it's
blocked — `New-NetFirewallRule -DisplayName "JSW Dashboard" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow`).

## Changing the port or app name

Edit the defaults at the top of `scripts/deploy.ps1` (`$AppName`, `$Port`). On the
next deploy PM2 will start a new process under the new name/port — stop the old one
manually once with `pm2 delete <old-name>`.

## Rolling back

Revert or `git reset` the bad commit on `main` and push — the same pipeline redeploys
the reverted code. There's no separate "rollback" mechanism; `main` is always what's live.
