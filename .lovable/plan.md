
## What I'll build

A new edge function `macro-data-agent` that uses Lovable AI (Gemini, with Google Search grounding) to fetch the latest values for:

1. **India at a glance** (`macro_snapshot` table) — GDP growth, CPI, repo rate, 10Y G-Sec, forex reserves, etc.
2. **Economic Indicators** (`country_indicators` table) — every country × indicator pair currently defined in `countries` × `indicator_definitions`.
3. **Interest Rates & Bonds** (`interest_rates` table) — policy rate + 10Y bond yield per country.

It runs **once daily at 03:00 IST** via pg_cron and auto-publishes results.

## No API key needed

You asked which free key — **none**. We'll use the **Lovable AI Gateway** (already provisioned: `LOVABLE_API_KEY`) with `google/gemini-2.5-flash` and Google Search grounding. This avoids signups, rate-limit headaches, and per-country API juggling.

> If, after a week, accuracy isn't good enough, I can layer in **FRED** (free key, US data), **World Bank** (no key), and **RBI** scraping as deterministic fallbacks. Starting AI-only per your choice.

## How it works

```text
pg_cron (03:00 IST daily)
        │
        ▼
edge fn: macro-data-agent
   1. Load schemas: macro_snapshot rows, countries, indicator_definitions, interest_rates rows
   2. For each group, ask Gemini (with Google Search) for latest values
      → returns structured JSON (value, previous, period, source URL)
   3. Compute delta, trend, sentiment server-side (not from the model)
   4. UPSERT into the 3 tables, status = 'published'
   5. Log run + per-row outcome into a new `macro_agent_runs` table
        │
        ▼
Frontend (already live) re-reads → values update automatically
```

## Key implementation details

- **Sentiment / trend** computed in code from `current vs previous` and each indicator's `higher_is_better` flag — the model only supplies raw numbers + source.
- **Source URL stored** on every row (`source`, `source_url`) so you can audit.
- **Confidence guard**: if the model returns null / cannot find a value, the existing row is left untouched (no overwrite with blanks).
- **Manual "Run now"** button added to the existing AI Agent admin page, alongside a small "Recent macro runs" table.
- **Auto-publish** as requested — values go live immediately.

## Files

- `supabase/migrations/...` — new `macro_agent_runs` table + pg_cron schedule.
- `supabase/functions/macro-data-agent/index.ts` — new edge function.
- `src/pages/admin/AIAgentCMS.tsx` — add a "Run macro data refresh" button + runs table.

## Risks / things to know

- LLM-fetched economic data can occasionally be stale or wrong. Auto-publish means errors go straight to the site. If you want a safety net later, I can add a "deviation > X%" rule that drops to draft for review.
- Lovable AI usage is billed from your workspace credits (~30-50 model calls/day for this agent).
