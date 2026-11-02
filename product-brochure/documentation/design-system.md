# FactoryOS — Design System Reference

Extracted directly from `src/index.css` (centralized design tokens) and the shared UI component library in `src/components/ui/`. These are the actual values the running application uses — not an approximation.

## Typography

- **Font family:** Inter (via `--font-sans`), falling back to system sans-serif.
- **Hierarchy is weight- and size-driven, not a large type scale:** card titles are `13px / bold / uppercase / wide tracking`; KPI values are `text-2xl / extrabold`; body/table text sits at `12–12.5px`; captions and deltas at `10.5–11px / semibold`. The interface favors density and legibility at small sizes over large display type — appropriate for an operations dashboard viewed on a control-room monitor.

## Color system

A single token file (`@theme` block) drives every dashboard, so status colors never drift screen to screen.

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-blue` | `#1e56c9` | Primary brand accent (user-customizable from Settings) |
| `--color-navy-950` / `--color-navy-900` | `#0a1a3a` / `#0d2050` | Primary text, sidebar background |
| `--color-status-good` | `#16a34a` | Positive status, "Running," "Present," "Good" |
| `--color-status-warn` | `#f59e0b` | Caution status, "Idle," "Average" |
| `--color-status-bad` | `#dc2626` | Negative status, "Breakdown," "Poor," alerts |
| `--color-status-info` | `#2563eb` | Informational accents |
| `--color-status-purple` | `#7c3aed` | Secondary metric accent (e.g. Performance in OEE) |
| `--color-status-teal` | `#0d9488` | Tertiary metric accent |
| `--color-surface` | `#ffffff` (light) / `#131c2e` (dark) | Card background |
| `--color-page` | `#eef1f8` (light) / `#0b1220` (dark) | App background |
| `--color-border` | `#e4e8f2` (light) / `#243049` (dark) | Card/table borders |

Every status color keeps the **same hue in both light and dark mode** — only backgrounds and surfaces flip — so a chart or badge reads identically regardless of theme. Dark mode is a first-class, fully-themed mode, not an afterthought: it's toggled live from Settings and verified to re-theme every token correctly.

## Shape & elevation

- **Card radius:** `1rem` (`--radius-card`), applied via a single shared `.card` utility class every surface in the app uses.
- **Shadow:** a two-layer soft shadow (`--shadow-card`) for resting state, with a slightly deeper `--shadow-card-hover` — restrained, not skeuomorphic.
- **Borders:** 1px hairline borders in the border token color separate card sections (header from body) and table rows.

## Core components (actual, not illustrative)

| Component | Role |
|---|---|
| `KpiCard` | Icon + label + large value + delta-or-caption; the atomic metric tile used across every dashboard (6–7 per page typically) |
| `Card` | The universal section container — title, optional subtitle, optional right-aligned action slot, body |
| `SimpleTable` | Zebra-striped, hover-highlighted data table with per-column alignment and custom cell renderers (used for every operational list — machines, orders, operators, incidents) |
| `StatusBadge` | Pill-shaped status label (good / average / warn / bad / info / neutral tones) used in every table's status column |
| `DonutStat` | Recharts-based donut with a center total and a value/percentage legend — the default breakdown visualization |
| `RadialScore` | Full-circle SVG progress ring with a centered value — used for single composite scores |
| `TrendChart` / line & bar charts | Recharts line/bar/area charts with themed grid, axis, and tooltip styling consistent across every trend panel |
| `RankedBars` | Horizontal ranked bar list — "Top 5" style panels (causes, defects, hazards, downtime reasons) |

## The 3D layer

The 3D Factory Monitoring dashboard is built on **three.js** via **@react-three/fiber** and **@react-three/drei**, not a separate visualization stack — it reuses the same status-color tokens (worker avatar colors map directly to the same good/warn/bad palette) so the 3D view and the 2D dashboards read as one visual system rather than two different products bolted together.

## Branding layer

Brand name, tagline, logo, primary accent color, sidebar color, and light/dark mode are **not hardcoded** — they're read from a runtime config and layered with any admin override saved from Settings (`src/branding/BrandingContext.tsx`). Changing them updates the CSS custom properties live, which is why every chart, badge, and button across all 13 dashboards re-colors instantly without a rebuild.
