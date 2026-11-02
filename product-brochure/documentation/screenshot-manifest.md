# FactoryOS — Screenshot Manifest

All screenshots captured live against `npm run dev` (http://localhost:5173) with Playwright + Chromium, viewport 1440×1000, device scale factor 2 (retina-quality for print). Full machine-readable data: `extraction-manifest.json` in this same directory.

| Route | Viewport screenshot | Full-page screenshot | Console errors |
|---|---|---|---|
| `/d/overview` | `01-ceo-scorecard-viewport.png` | `01-ceo-scorecard-full.png` | 0 |
| `/d/orders` | `02-order-status-viewport.png` | `02-order-status-full.png` | 0 |
| `/d/production-line` | `03-production-line-viewport.png` | `03-production-line-full.png` | 0 |
| `/d/machine-health` | `04-machine-health-viewport.png` | `04-machine-health-full.png` | 0 |
| `/d/operator` | `05-operator-viewport.png` | `05-operator-full.png` | 0 |
| `/d/safety` | `06-safety-incident-viewport.png` | `06-safety-incident-full.png` | 0 |
| `/d/environment` | `07-environment-viewport.png` | `07-environment-full.png` | 0 |
| `/d/quality` | `08-quality-viewport.png` | `08-quality-full.png` | 0 |
| `/d/production-ops` | `09-production-ops-viewport.png` | `09-production-ops-full.png` | 0 |
| `/d/energy-utilities` | `10-energy-utilities-viewport.png` | `10-energy-utilities-full.png` | 0 |
| `/d/maintenance` | `11-maintenance-viewport.png` | `11-maintenance-full.png` | 0 |
| `/d/hse` | `12-hse-viewport.png` | `12-hse-full.png` | 0 |
| `/d/factory-3d` | `13-factory-3d-viewport.png` | `13-factory-3d-full.png` | 0 (3D scene allowed 3s to settle before capture) |
| `/settings` | `14-settings-viewport.png` | `14-settings-full.png` | 0 |

**Locked / not captured (verified inaccessible, not fabricated):**
- Inventory (`slug: inventory`, sidebar slot 6) — no route registered, sidebar entry rendered with lock icon.
- Executive Summary (`slug: executive`, sidebar slot 14) — no route registered, sidebar entry rendered with lock icon.

Every accessible page returned **zero browser console errors** during capture.
