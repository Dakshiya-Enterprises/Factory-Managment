<#
  Idempotent redeploy step run by .github/workflows/deploy.yml on the
  self-hosted Windows runner, after checkout + npm ci + npm run build
  have already put a fresh dist/ in the workspace.

  First run: no PM2 process named $AppName exists yet, so this starts
  one with `pm2 serve`, which serves dist/ as static files and picks up
  future builds from disk automatically (no restart strictly required
  for content changes) — but we restart anyway on every deploy so a
  "deploy" always visibly does something and PM2's log/uptime reflects
  the latest push.
#>
param(
  [string]$AppName = "jsw-dashboard",
  [int]$Port = 3000
)

$ErrorActionPreference = "Stop"

Write-Host "Deploying '$AppName' on port $Port from $PWD ..."

$existing = pm2 jlist | ConvertFrom-Json | Where-Object { $_.name -eq $AppName }

if ($existing) {
  Write-Host "Found existing PM2 process '$AppName' — restarting."
  pm2 restart $AppName
} else {
  Write-Host "No existing PM2 process '$AppName' — starting it with 'pm2 serve'."
  pm2 serve dist $Port --name $AppName --spa
}

pm2 save

Write-Host "Done. '$AppName' is serving dist/ on http://localhost:$Port"
