# FactoryOS — Feature Documentation

Every section below is derived from the actual rendered page (card titles, KPI labels, and table columns captured live) — see `extraction-manifest.json` for the raw structural data each description is built from.

---

## 1. CEO Live Scorecard — `/d/overview`

**Purpose.** A single roll-up screen for plant leadership: the questions "are we making money, are we efficient, and what needs my attention today" answered in one view without opening a single spreadsheet.

**Capabilities.** Factory Overview (lines, machines, operators, supervisors, working days, shift) and an overall-performance gauge sit beside ten KPI cards covering Revenue, Profit, Gross Margin, Factory/Line Efficiency, OTIF Delivery, Reject Rate, Absenteeism, Machine Availability, and Energy Cost per piece — each with a trend sparkline, a vs-yesterday delta, and a Good/Average/Poor status tag. A Top Alerts panel surfaces the five most urgent cross-functional issues (e.g. a specific line's efficiency shortfall, a specific machine's vibration reading, a specific order's delay risk), and a production donut plus an 8-hour live trend chart close out the screen.

**Workflow.** A plant manager opens the Scorecard first thing, scans the status tags for anything red/amber, reads the Top Alerts list to see which line/machine/order needs attention, then drills into the relevant dedicated dashboard (Production Line, Machine Health, Order Status) to act.

**Business value.** Collapses revenue, efficiency, quality, safety, and energy metrics — normally owned by five different teams — into one screen, so leadership spends minutes, not meetings, finding out what's wrong today.

---

## 2. Order Status — `/d/orders`

**Purpose.** Tracks every purchase order from PO issuance to dispatch, with AI-assisted delay prediction.

**Capabilities.** KPIs for Total Orders, Total Quantity, Completed/In Progress/Pending volume, and On-Time Delivery %. The order tracking table carries 15 columns per order — buyer, PO number, style number, order/completed/balance quantity, % complete, expected dispatch, risk %, delay prediction, current line, current operator, efficiency, predicted delay, and a suggested action. A Buyer Wise Orders chart, a Delay Risk Summary, a Top 5 High Risk Orders ranking, and an "AI Prediction & Recommendation" panel (with a "View Detailed AI Insights" action) round out the page.

**Workflow.** A planner filters/scans the order table for high risk-% rows, checks the predicted delay and suggested action, and reassigns the order to a different line/operator or escalates before the customer is affected.

**Business value.** Surfaces at-risk orders before the delay happens rather than after, by exposing risk % and a concrete suggested action against every open PO, not just a static due-date list.

---

## 3. Production Line — `/d/production-line`

**Purpose.** Real-time view of every production line's throughput against target.

**Capabilities.** KPIs for Total Lines, Avg Line Efficiency, Total Output/Target Today, Lines Below Target, and Operators at Work. A Line Summary panel and a Line Status Overview sit alongside a "Plant Layout" line-performance heat map, a Top Alerts feed, a Line Performance Trend chart, and a Quick Actions panel.

**Workflow.** A production supervisor scans the plant-layout heat map for red/underperforming cells, cross-references the Top Alerts panel, and uses a quick action (e.g. reallocate operators) to respond without leaving the screen.

**Business value.** Turns 40 individual production lines into one glanceable spatial map, so a shortfall on a specific line is visible immediately rather than discovered at end-of-shift reporting.

---

## 4. Machine Health — `/d/machine-health`

**Purpose.** Condition-monitoring and OEE tracking for the full 980-machine fleet.

**Capabilities.** Fleet-status KPIs (Total/Running/Idle/Breakdown/Maintenance machines, Overall Availability) sit above a Machine Utilization donut and an **OEE Overview** — a concentric radial gauge (Availability × Performance × Quality = OEE) with an inline progress-bar legend, refreshing live each cycle. A 12-column Machine Health List (ID, line, model, status, health score, running hours, stitch count, needle count, vibration, temperature, last service, RUL) is the operational core, backed by a Top Alerts feed, a Health Score Breakdown donut, a Machine Age Profile, 7-day Health and Breakdown trend charts, an RUL (Remaining Useful Life) distribution, and the Top 5 Machine Downtime Reasons.

**Workflow.** A maintenance engineer opens the dashboard, checks the OEE gauge for the fleet-wide composite score, filters the machine list for any row in Breakdown status or with RUL under 7 days, and schedules intervention before a failure stops the line.

**Business value.** Converts raw sensor-style readings (vibration, temperature, running hours) into an actionable health score and remaining-life estimate per machine, so maintenance is scheduled on condition rather than a fixed calendar.

---

## 5. Operator — `/d/operator`

**Purpose.** People-performance and attendance tracking across the 1,248-person operator workforce.

**Capabilities.** KPIs for Total/Present/Absent operators, Avg Efficiency, Top Performers, and a Happiness Index. The 12-column Operator Performance List (emp ID, name, line, skill, efficiency vs target, output, reject %, attendance, today's incentive, happiness score, status) is the main workspace, supported by a skill-distribution donut, a happiness-index breakdown, a Today's Top Performers ranking, a 7-day efficiency trend, a reject-rate-by-skill-group comparison, and an Incentive Payout Today total.

**Workflow.** An HR or line manager reviews the performance list, identifies operators below their efficiency target or with a low happiness score, and uses the Top Performers / incentive data to plan recognition or coaching.

**Business value.** Links performance (efficiency, output, reject rate) directly to engagement (happiness index) and pay (today's incentive) in one roster, making the connection between workforce wellbeing and productivity visible rather than anecdotal.

---

## 6. Safety & Incident — `/d/safety`

**Purpose.** Real-time incident logging and lagging-indicator tracking (LTIFR/TRIFR) for the plant.

**Capabilities.** KPIs for Total Incidents, LTIFR, TRIFR, Medical Treatment Cases, Safety Observations, and Safety Training Hours (all YTD). A 9-column Incident Details table (ID, date/time, location, type, severity, description, LTI potential, status, days open) sits beside an Incident Summary donut, an Incidents-by-Location ranking, a 12-month LTIFR trend with a target reference line, a Top 5 Incident Causes ranking, a Safety Observations donut, a Severity Distribution donut, and Near Miss Reporting.

**Workflow.** A safety officer monitors the incident table for any Open status row, checks severity and LTI potential, and tracks the LTIFR trend against the target line to confirm the plant is improving month over month.

**Business value.** Makes the gap between leading indicators (safety observations, near-misses reported) and lagging indicators (LTIFR, actual incidents) visible on one screen, supporting a proactive rather than reactive safety program.

---

## 7. Environment & Sustainability — `/d/environment`

**Purpose.** Environmental compliance and sustainability metrics: emissions, water, waste, and renewable energy mix.

**Capabilities.** KPIs for Total and Specific CO₂ Emission, Water Consumption, Water Recirculation %, Waste Generated, Waste Utilization %, and Green Energy Usage %. A 7-column live Environmental Parameters table (parameter, location, unit, real-time value, limit, status, vs yesterday) tracks individual compliance readings against regulatory limits, alongside an Emission Summary donut, a Water Consumption Breakdown, a Carbon Footprint Trend (tCO₂/t steel), Renewable Energy Usage, and 12-month CO₂, water, and waste trend charts.

**Workflow.** An EHS/sustainability officer scans the live parameter table for any reading over its limit (flagged by status), and reviews the 12-month trend charts to confirm long-term emission and water-intensity reduction.

**Business value.** Puts real-time regulatory-limit compliance and long-term sustainability trend reporting on the same screen, supporting both daily operational compliance and annual ESG reporting from one data source.

---

## 8. Quality Management — `/d/quality`

**Purpose.** Plant-wide quality conformance: first pass yield, rejection rate, process capability, and customer complaints.

**Capabilities.** KPIs for Overall Quality Score, First Pass Yield, Total Rejections (MT), Customer Complaints, Process Capability (Cpk), and QC Inspections (all YTD). An 11-column line/area quality table (product, grade, production/inspected MT, FPY %, rejection MT/%, Cpk, quality score, status) is the operational center, backed by a 12-month Quality Score Trend, a Rejection Breakdown donut, a Top Defect Types ranking, a Quality Cost card, and 12-month First Pass Yield, Process Capability (Cpk), and Rejection % trend charts.

**Workflow.** A quality manager reviews the line/area table for any row with Cpk below the process-capability target or a rejection % spike, and cross-references the Top Defect Types ranking to identify the recurring failure mode to address.

**Business value.** Connects statistical process control (Cpk) directly to commercial outcomes (rejection MT, customer complaints), so a capability problem is caught as a quality-engineering signal before it becomes a customer-facing one.

---

## 9. Production & Operations — `/d/production-ops`

**Purpose.** The operational counterpart to the CEO Scorecard: plant/unit-level production, OEE, and downtime, with 14 cards — the densest dashboard in the platform.

**Capabilities.** KPIs for Total/Today/Target Production (MT), Overall OEE, and Planned/Unplanned Downtime (hours). A 9-column Real Time Production Summary table (unit/shop, product, grade, target/actual MT, achievement %, OEE %, status, vs yesterday) anchors the page, surrounded by Production by Plant, Production Mix, an Overall OEE Breakdown, a Downtime Summary, Target Achievement, a 7-day Production Trend, Hourly Production Today, Cumulative Production, a 7-day OEE Trend, OEE by Unit, a 7-day Downtime Trend, Production Plan vs Actual, and the Top 5 Downtime Reasons.

**Workflow.** An operations director compares Target Achievement % and OEE by Unit to find the underperforming plant/unit, then checks the Top 5 Downtime Reasons and the downtime trend to decide whether the issue is planned maintenance load or unplanned failures.

**Business value.** Separates planned from unplanned downtime at the unit level, which is the single most common blind spot in plant reporting — unplanned downtime is where OEE is actually being lost, and this page isolates it explicitly.

---

## 10. Energy & Utilities — `/d/energy-utilities`

**Purpose.** Consumption, cost, and efficiency tracking across energy, water, steam, and fuel — plus identified savings opportunities.

**Capabilities.** KPIs for Total Energy, Energy Cost, Specific Energy (kWh/t), Water/Steam/Fuel Consumption, and a Utilization Index (all YTD). A 14-column Utility Consumption Summary table (today/yesterday/MTD/LY MTD/variance/YTD/LYTD per utility) is the core, plus an Energy Mix and Cost Breakdown donut, an Energy Cost Trend (both ₹ Cr and 12-month views), a Specific Energy Trend, Daily Energy Consumption, Energy Savings, Energy Performance vs Target, a Plant Wise Specific Energy ranking, Alerts & Notifications, and an Energy Savings Opportunities table.

**Workflow.** An energy manager checks the Utility Consumption table for any utility with a negative variance vs last year, then reviews the Savings Opportunities table (which pairs each opportunity with potential MWh/₹ Cr savings per year) to prioritize the next efficiency project.

**Business value.** Puts a potential-savings figure in rupees-per-year directly next to every identified opportunity, turning energy management from a cost-reporting exercise into a prioritized action list.

---

## 11. Maintenance Performance — `/d/maintenance`

**Purpose.** Work-order and reliability tracking: MTTR, MTBF, PM compliance, and cost, at the area/shop level.

**Capabilities.** KPIs for MTTR, MTBF, PM Compliance %, Breakdowns, Maintenance Cost, and Asset Availability (all YTD). Two area-level tables — a 15-column Maintenance Summary (total assets, PM plan/completed/compliance, breakdowns, MTTR, MTBF, cost, status) and a Planned Shutdowns/Turnaround schedule (area, start/end date, progress) — anchor the page, supported by a Maintenance Cost Breakdown donut, a Work Order Status donut, Breakdowns by Category, the Top 5 Repeating Breakdown Assets, 12-month PM Compliance, MTTR, MTBF, and Cost trend charts, Asset Availability, Scheduled vs Unscheduled work, Spares Consumption, and Critical Assets Health.

**Workflow.** A reliability engineer reviews the Top 5 Repeating Breakdown Assets to find chronic failure points, checks whether those assets' PM compliance is lagging, and cross-references the Scheduled vs Unscheduled split to justify a shift toward more preventive maintenance.

**Business value.** Isolates *repeating* breakdown assets specifically — the highest-leverage maintenance signal, since a recurring failure on the same asset is a root-cause problem, not a random event.

---

## 12. HSE Performance — `/d/hse`

**Purpose.** Plant-wide Health, Safety & Environment compliance program tracking, including behaviour-based safety and permit-to-work compliance.

**Capabilities.** KPIs for LTIFR, TRIFR, Total Incidents, Near Miss count, Safety Observations, First Aid Cases, and Man Hours (all YTD). Two tables carry the operational detail: a 14-column HSE Performance by Plant table and a Critical Risk Control Status table (risk category, total/effective/partially-effective/ineffective controls). An Incident Breakdown donut, an HSE Performance Index, 12-month Incident and 6-month Near Miss trend charts, Top Incident Locations, Safety Training, Behaviour Based Safety, Permit Compliance, Hazard Reporting, and the Top 5 Hazards complete the page.

**Workflow.** An HSE head reviews the Critical Risk Control Status table for any control marked "ineffective," prioritizes closing that gap, and tracks the plant-by-plant performance table to see which site needs the most support.

**Business value.** The Critical Risk Control effectiveness breakdown is a maturity signal most safety dashboards omit — it answers "are our controls actually working," not just "how many incidents did we have."

---

## 13. 3D Factory Monitoring & Surveillance — `/d/factory-3d`

**Purpose.** A live, navigable 3D digital twin of the factory floor showing exactly where every tracked worker, CCTV camera, WiFi access point, and transport asset is right now — the platform's signature spatial-intelligence capability.

**Capabilities.** KPIs for Workers Present, Active Alerts, Zones Over Capacity, Cameras Online, WiFi APs Online, and Avg Idle Time. The centerpiece is an interactive, orbit-controllable 3D factory model — complete with a roof, parking lot, delivery trucks, zone-labeled production areas (Line 01–04, Cutting, Sewing, Finishing, and a flagged Chemical Store restricted zone), animated camera markers, pulsing WiFi access-point markers, and worker avatars that physically walk between zones — with four view modes: **3D Perspective**, **Top-Down**, **Cross-Section** (cutaway), and **VR** (WebXR immersive mode, hardware permitting). A live Active Alerts feed flags events as they happen — a worker entering the restricted Chemical Store zone, or a presence signal being lost — a clickable Worker Presence list lets an operator click any name to fly the camera to that worker's location, per-zone Production Zone cards show headcount/productivity/efficiency per line, and a Logistics Today panel tracks deliveries, train runs, truck trips, and forklift activity.

**Workflow.** A security or floor operations lead opens the 3D view, watches the Active Alerts feed for a restricted-zone entry, clicks the flagged worker's name in the Worker Presence list, and the camera flies to their exact location in the 3D model for visual confirmation — then checks the nearest CCTV marker's online status to confirm footage is available.

**Business value.** Converts abstract presence data (a name and a zone ID) into spatial awareness (where, physically, relative to hazards and infrastructure) — the difference between a log entry and being able to see where an at-risk worker actually is.

**Design note — data provenance.** Every tracked worker carries a `source` field (`cctv` | `wifi` | `simulated`); today's build runs on realistic simulated presence data by design, with the data contract already shaped so a real computer-vision/WiFi-RTLS pipeline can be connected without changing this screen.

---

## 14. Settings — `/settings`

**Purpose.** White-label branding and theme administration — the mechanism that lets this same codebase serve any manufacturing customer under its own identity.

**Capabilities.** A Brand Identity panel (brand name, tagline, full/legal name, with a Reset to Default action), a Logo panel (upload/remove a custom logo image), and a Theme panel (Light/Dark mode toggle plus live accent-color selection) — changes apply immediately across the sidebar and every dashboard header, with no reload required.

**Workflow.** An administrator onboarding a new customer opens Settings, replaces the brand name/logo/accent color, and every one of the 13 live dashboards re-renders under the new identity instantly.

**Business value.** This is what makes FactoryOS a genuine multi-tenant SaaS product rather than a single-customer build — rebranding is a two-minute in-app task, not an engineering request.

---

## Planned (not yet built)

Two dashboard slots are reserved in the navigation but intentionally locked (no route exists, sidebar entry is disabled):

- **Inventory** — "Spares & Stock" (slot 6)
- **Executive Summary** — "Plant-Wide Roll-up" (slot 14)

These are documented here as committed roadmap, not fabricated functionality — verified by the absence of a route in `App.tsx` and the locked/disabled styling in the sidebar.
