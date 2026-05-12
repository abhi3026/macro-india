## Goal

Make the Economic Indicators system fully CMS-driven (homepage table + Data Dashboard page + macro snapshot), without changing the visual design of the public site. CMS becomes a Bloomberg-style data terminal with inline edit/update, auto difference calculation, and support for all Trading Economics countries.

---

## 1. Database redesign (migration)

The current `economic_indicators` table is a flat single-value list — it can't represent country × indicator × current/previous. Replace with a normalized schema:

**`countries`**
- `code` (text, PK, e.g. `in`, `us`)
- `name`, `flag_emoji`, `flag_url`
- `show_on_homepage` (bool) — controls which countries appear in the homepage table; only the existing 9 set true
- `display_order` (int)

**`indicator_definitions`** (editable headings/labels)
- `key` (text, PK, e.g. `gdp_growth`, `inflation`, `business_confidence`)
- `label` (text, editable — drives table column headings everywhere)
- `unit` (text, e.g. `%`, `points`, `USD bn`)
- `higher_is_better` (bool, nullable) — drives green/red coloring
- `display_order` (int)
- `show_on_homepage` (bool) — which columns appear on homepage table
- `show_on_dashboard` (bool)

**`country_indicators`** (one row per country × indicator)
- `country_code` → countries.code
- `indicator_key` → indicator_definitions.key
- `current_value` (numeric)
- `previous_value` (numeric)
- `period_label` (text, e.g. `Q4/24`)
- `source`, `source_url`
- `notes`
- `status` (`published` | `draft`)
- `last_updated` (timestamptz, auto-stamped)
- generated column `difference = current_value - previous_value` (computed in SQL or in app)
- UNIQUE(country_code, indicator_key)

**RLS:** public read where `status='published'`; managers (`can_manage`) full write. Same pattern as existing tables.

**Seed:** migrate the current hardcoded homepage data (9 countries × 8 indicators) into the new tables so nothing visually changes on day one. Keep the old `economic_indicators` table untouched for now (drop in a follow-up) to avoid breaking anything.

---

## 2. CMS — Indicators terminal (`/admin/indicators`)

Replace `src/pages/admin/IndicatorsCMS.tsx` with a Bloomberg-style data grid:

**Layout**
- Sticky header row with editable column = indicator labels (click to rename → updates `indicator_definitions.label`)
- Sticky left column = country (flag + name)
- Grid cells = one country × indicator. Each cell shows two stacked rows:
  - **Current** value
  - **Previous** value
  - Auto-rendered **difference chip** (+/-, green/red/gray)
- Right-side action column per row: **Edit** / **Update** (Save) / Cancel
- Edit mode makes current, previous, label/heading (column), source, period inline-editable
- Update writes to DB, recomputes difference, invalidates React Query cache → frontend refetches automatically (no redeploy)

**Controls above the grid**
- Search by country / indicator
- Filters: homepage-only, dashboard-only, status
- "Add country" (picks from a built-in Trading Economics country list — see §4)
- "Add indicator definition" (key + label + unit)
- Toggle `show_on_homepage` and `show_on_dashboard` per country and per indicator (checkboxes in headers / left column)

**Styling:** monospaced numerics, tight rows, subtle hover, sticky corners, no oversized cards. Reuses existing shadcn `Table` + `Input` primitives so it stays consistent with current CMS look.

---

## 3. Wire frontend to CMS (no visual changes)

**`src/components/EconomicIndicatorsDashboard.tsx`** (homepage)
- Remove `DEFAULT_ECONOMIC_DATA`
- React Query: fetch countries where `show_on_homepage=true`, indicators where `show_on_homepage=true`, plus their `country_indicators`
- Map into the existing CountryData shape; keep current JSX, columns, colors, formatting **identical**
- Column headings driven by `indicator_definitions.label`
- Change badge uses computed `current - previous`

**`src/pages/EconomicIndicatorsPage.tsx`** (`/data-dashboard/economic-indicators`)
- Remove `defaultCountries`
- Same query but no `show_on_homepage` filter (all countries, all dashboard indicators)
- Feed into existing `<EconomicTable>` — keep its UI as-is
- Extend `EconomicData` to be schema-driven (record of indicator_key → value) so new indicators added in CMS appear without code changes; keep the current 8 columns visible by default

**`src/components/MacroSummary.tsx`** (India-at-a-glance strip)
- Replace hardcoded `metrics` with a query for India's published indicators (`gdp_growth`, `inflation`, `repo_rate`, `g_sec_10y`, `usd_inr`, `forex_reserves`)
- Keep all styling, grid, icons untouched
- Trend derived from sign of difference; "context" stored as `notes` field

No other components or styles change.

---

## 4. Trading Economics country expansion

Seed `countries` with the full Trading Economics country list (~190 entries: code, name, flag emoji). Only 9 keep `show_on_homepage=true`; all are visible on the dashboard once they have at least one published indicator. New rows for `country_indicators` are created on demand from the CMS "Add country" / per-cell edit flow — no backfill of fake values.

---

## 5. Performance

- React Query with 60s stale time on public reads
- Single batched query per page (countries + definitions + values via Postgres joins / parallel selects)
- Indexed lookups on `country_indicators(country_code, indicator_key)` and `(status)`
- CMS grid uses virtualized scroll only if >500 rows visible (skip for now; pagination by country first)

---

## 6. Out of scope (this task)

- No changes to public site visual design, layout, spacing, colors
- No changes to Research, Education, Weekly Reads, Interest Rates modules
- No external API auto-sync — schema is ready for it but values are entered/edited manually in CMS for now
- Old `economic_indicators` table left in place; can be dropped once new system is verified

---

## Technical notes

- Migration creates 3 new tables + RLS + seed data; existing `economic_indicators` table untouched
- `useAuth().canManage` already gates write actions
- All public reads filter `status = 'published'` — already covered by RLS
- Difference computed in SQL view `v_country_indicators` for convenience, or in TS — TS chosen to keep schema simple
- Column headings being editable means the homepage `<TableHead>` text comes from the definitions query (purely text swap, no layout change)