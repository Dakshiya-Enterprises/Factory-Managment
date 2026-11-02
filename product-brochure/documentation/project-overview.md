# FactoryOS — Project Overview

## Identity

| | |
|---|---|
| Product name | **FactoryOS** |
| Positioning line (shipped default) | "Powered by Intelligence" |
| Full/legal name (shipped default) | FactoryOS — Intelligent Manufacturing Platform |
| Document title | FactoryOS — Intelligent Manufacturing Platform |
| Package name | `factory-monitoring-platform` |

Brand name, tagline, logo, and accent colors are **runtime-configurable** from the in-app Settings page — every deployment can be relabeled for a different customer without a code change (see the Administration module).

## Architecture (as verified in source)

FactoryOS is a **client-side single-page application**. There is no backend server, database, or authentication layer in this codebase — every dashboard is powered by typed, continuously-refreshing mock data generators, architected so a real data pipeline (ERP, MES, SCADA, IoT broker, computer vision) can be swapped in later without touching any UI component.

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router 6 (hash-based) |
| Styling | Tailwind CSS v4, centralized design tokens |
| 2D charting | Recharts |
| 3D rendering | three.js + @react-three/fiber + @react-three/drei |
| Icons | lucide-react |
| State/refresh | A shared polling hook (`useLiveData`) re-fetches every dashboard's data on a fixed interval, so every screen reads "live" without a manual refresh |

## What the platform does

FactoryOS is a **real-time factory operations command center** for a discrete or process manufacturing plant. It consolidates the metrics a plant leadership team, production managers, maintenance engineers, safety officers, and quality teams would otherwise track in separate spreadsheets and point tools — production throughput, machine health, operator performance, order fulfillment, safety incidents, environmental compliance, energy consumption, and (uniquely) a live 3D digital twin of the factory floor showing where every tracked worker, camera, and transport asset physically is at any moment.

## Who it serves

The page set implies four primary audiences, each with a dedicated home screen:

- **Plant leadership** — the CEO Live Scorecard rolls every KPI up to one screen.
- **Production & operations managers** — line-level throughput, OEE, and downtime across Production Line and Production & Operations.
- **Maintenance & reliability engineers** — Machine Health and Maintenance Performance track asset condition and work-order compliance.
- **EHS (Environment, Health & Safety) teams** — Safety & Incident and HSE Performance track incident rates, near-misses, and compliance; Environment & Sustainability tracks emissions, water, and waste.
- **Site security / workforce operations** — the 3D Factory Monitoring module gives a literal floor-plan view of worker presence, restricted-zone entry, and camera/WiFi infrastructure status.

## Module count

12 logical modules, 15 total dashboard slots, **13 live** + **2 planned ("coming soon," locked in navigation)**, plus a 14th accessible page (Settings/Administration) outside the dashboard slot system. See `page-inventory.md` for the full breakdown.
