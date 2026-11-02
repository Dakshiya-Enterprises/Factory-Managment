# FactoryOS — Page Inventory

All data verified live against the running application (`npm run dev`, inspected with Playwright at 1440×1000, 2× device scale). 13 of 15 dashboard slots are live; 2 are locked "coming soon" placeholders. Settings is a 14th accessible page outside the dashboard slot system.

| # | Module | Page | Route | Access | Screenshot |
|---|---|---|---|---|---|
| 1 | Executive Intelligence | CEO Live Scorecard | `/d/overview` | Live | `01-ceo-scorecard-viewport.png` |
| 2 | Order Management | Order Status | `/d/orders` | Live | `02-order-status-viewport.png` |
| 3 | Production | Production Line | `/d/production-line` | Live | `03-production-line-viewport.png` |
| 4 | Asset & Machine Management | Machine Health | `/d/machine-health` | Live | `04-machine-health-viewport.png` |
| 5 | Workforce | Operator | `/d/operator` | Live | `05-operator-viewport.png` |
| 6 | *(planned)* | Inventory — Spares & Stock | *(locked)* | **Coming soon** | not applicable — locked, not navigable |
| 7 | Safety & Compliance | Safety & Incident | `/d/safety` | Live | `06-safety-incident-viewport.png` |
| 8 | Sustainability | Environment & Sustainability | `/d/environment` | Live | `07-environment-viewport.png` |
| 9 | Quality | Quality Management | `/d/quality` | Live | `08-quality-viewport.png` |
| 10 | Production | Production & Operations | `/d/production-ops` | Live | `09-production-ops-viewport.png` |
| 11 | Utilities | Energy & Utilities | `/d/energy-utilities` | Live | `10-energy-utilities-viewport.png` |
| 12 | Asset & Machine Management | Maintenance Performance | `/d/maintenance` | Live | `11-maintenance-viewport.png` |
| 13 | Safety & Compliance | HSE Performance | `/d/hse` | Live | `12-hse-viewport.png` |
| 14 | *(planned)* | Executive Summary — Plant-Wide Roll-up | *(locked)* | **Coming soon** | not applicable — locked, not navigable |
| 15 | Spatial Intelligence | 3D Factory Monitoring & Surveillance | `/d/factory-3d` | Live | `13-factory-3d-viewport.png` |
| — | Administration | Settings | `/settings` | Live | `14-settings-viewport.png` |

## Access verification

The sidebar renders all 15 dashboard slots, but **Inventory** and **Executive Summary** are rendered with a lock icon and `cursor-not-allowed` styling — confirmed programmatically (no route exists for either slug in the router, and the sidebar does not treat them as clickable links). They are documented here as planned capability, not fabricated screens.

## Per-page summary

| Page | Primary KPIs tracked | Data table(s) | Key visual components |
|---|---|---|---|
| CEO Live Scorecard | Revenue, Profit, Gross Margin, Factory/Line Efficiency, OTIF, Reject Rate, Absenteeism, Machine Availability, Energy Cost/pc | — | Factory overview list, performance gauge, 10 sparkline KPI cards, alerts feed, production donut, live trend chart |
| Order Status | Total Orders, Quantity, Completed/In Progress/Pending, On-Time Delivery | 15-column order tracking table | Buyer-wise bar chart, delay-risk summary, AI prediction panel |
| Production Line | Total Lines, Avg Efficiency, Output vs Target, Lines Below Target, Operators at Work | — | Line summary cards, plant layout heat-map, performance trend chart, quick actions |
| Machine Health | Total/Running/Idle/Breakdown/Maintenance machine counts, Overall Availability | 12-column machine list | Utilization donut, concentric OEE radial gauge, health-score donut, age-profile bars, 7-day health/breakdown trend charts, RUL distribution |
| Operator | Total/Present/Absent, Avg Efficiency, Top Performers, Happiness Index | 12-column operator roster | Skill-distribution donut, happiness breakdown, top-performer ranking, 7-day efficiency trend, reject-rate-by-group bars |
| Safety & Incident | Total Incidents, LTIFR, TRIFR, MTC, Safety Observations, Training Hours | 9-column incident log | Incident-summary donut, location ranking, 12-month LTIFR trend, top-cause ranking, severity donut |
| Environment & Sustainability | CO₂ Emission (total + specific), Water Consumption, Recirculation %, Waste Generated/Utilization, Green Energy % | 7-column live environmental-parameter table | Emission/water donuts, 12-month CO₂/water/waste trend charts, energy-mix donut |
| Quality Management | Overall Quality Score, First Pass Yield, Total Rejections, Customer Complaints, Process Capability (Cpk), QC Inspections | 11-column line/area quality table | 12-month quality-score trend, rejection-breakdown donut, defect-type ranking, FPY/Cpk/rejection trend charts |
| Production & Operations | Total/Today/Target Production, Overall OEE, Planned/Unplanned Downtime | 9-column unit/shop production table | Production-by-plant chart, production-mix donut, OEE breakdown, downtime summary, hourly/cumulative production charts |
| Energy & Utilities | Total Energy, Energy Cost, Specific Energy, Water/Steam/Fuel Consumption, Utilization Index | 14-column utility consumption table | Energy-mix donut, cost breakdown, 12-month energy cost trend, savings-opportunity table, plant-wise specific-energy ranking |
| Maintenance Performance | MTTR, MTBF, PM Compliance, Breakdowns, Maintenance Cost, Asset Availability | 15-column area/shutdown tables | Cost-breakdown donut, work-order-status donut, breakdown-by-category ranking, 12-month PM/MTTR/MTBF/cost trends |
| HSE Performance | LTIFR, TRIFR, Total Incidents, Near Miss, Safety Observations, First Aid Cases, Man Hours | 14-column plant/risk-control tables | Incident-breakdown donut, plant performance table, 12-month incident trend, 6-month near-miss trend, hazard ranking |
| 3D Factory Monitoring & Surveillance | Workers Present, Active Alerts, Zones Over Capacity, Cameras/WiFi APs Online, Avg Idle Time | live worker-presence list | Interactive 3D digital-twin factory (Perspective / Top-Down / Cross-Section / VR view modes), per-zone production cards, live alert feed, supply-chain/logistics panel |
| Settings | — | — | Brand Identity editor, logo uploader, light/dark theme + accent color picker |
