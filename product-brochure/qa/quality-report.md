# FactoryOS Brochure — Quality Assurance Report

## Render pipeline

`source/brochure.html` + `source/brochure.css` → rendered with Playwright/Chromium → `final-brochure.pdf` (25 fixed 1600×1000px landscape pages, `printBackground: true`, zero margins). Screenshots embedded in the brochure were captured live from the running application (see `documentation/screenshot-manifest.md`), not fabricated.

## Automated checks

- **Overflow check** — every `.page` element's `scrollHeight` was compared against its fixed 1000px box height after each render pass. Initial render found 1 of 25 pages overflowing (Platform Overview, by 51px); fixed by tightening module-grid and table-row spacing. **Final result: 0 of 25 pages overflow.**
- **Page count** — verified the generated PDF contains exactly 25 `/Type /Page` objects, matching the HTML's 25 `<section class="page">` elements.
- **Source screenshot console errors** — all 14 live application pages captured for the brochure returned 0 browser console errors during capture (see `documentation/extraction-manifest.json`).

## Visual inspection (contact sheet)

A 5×5 contact sheet of all 25 pages (`contact-sheet.png`) plus individual full-resolution captures of every page (`pages/page-01.png` … `page-25.png`) were generated and reviewed. Issues found and fixed:

| # | Issue found | Fix applied | Verified |
|---|---|---|---|
| 1 | Platform Overview page (page 3) content overflowed its page box by 51px | Reduced module-tile padding and table row padding | Re-rendered, 0px overflow |
| 2 | 3D Factory Monitoring page (page 21) — the flagship/signature screen — had a large empty gap below its feature row; hero shot was undersized relative to available space | Increased hero screenshot display height from 430px to 600px | Re-rendered, page now reads as a proper hero spread |
| 3 | All six "Layout C" module pages (Order Status, Production & Operations, Maintenance, Safety & Incident, Environment, Energy & Utilities) had a visible dead-space gap between the screenshot and the bottom margin | Increased shot height from 420px to 520px across all six pages | Re-rendered, confirmed via contact sheet — gap eliminated |
| 4 | Design System page (page 23) was roughly half empty below the color/typography/component samples | Added a live-styled data-table sample (zebra striping, status badges, matching the app's actual `SimpleTable` component) and a light/dark mode side-by-side comparison (colors sourced directly from `src/index.css`'s dark-theme token overrides) | Re-rendered, page now reads as complete |

No defects found in: typography rendering, color consistency against the app's actual token values, alignment, repeated/duplicated content, broken image references, or page-break placement. Every screenshot embedded is the actual captured PNG (full file paths verified to resolve) — none were substituted or mocked.

## Content accuracy

Every feature claim in the brochure traces to one of two sources, both checked against the live, running application rather than source-code assumption alone:

1. `documentation/extraction-manifest.json` — card titles, KPI labels/values, and table column headers extracted programmatically from the rendered DOM of each page.
2. Direct visual confirmation in the corresponding screenshot.

The two locked/"coming soon" dashboard slots (Inventory, Executive Summary) are documented as planned capability, not fabricated — confirmed both by the absence of a route in `src/App.tsx` and by the disabled/locked styling verified live in the sidebar (`lockedEntries` in the extraction manifest).

## Final state

- **PDF**: `final-brochure.pdf` — 25 pages, 8.7 MB, zero overflow, zero broken images.
- **Re-render count**: 3 full render passes (initial → overflow fix → visual-balance fixes).
