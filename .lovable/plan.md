# AI Content Agent — Plan

An autonomous agent that runs daily, picks topics on its own, and saves 5 SEO-ready drafts distributed across **Educational Posts**, **Research Articles**, and **Weekly Reads**. Every generation lands as a `draft` — nothing publishes automatically. Editors review and approve through existing CMS screens.

## Scope

- Topics: Indian + global financial markets, investments, mutual funds, macroeconomics, personal finance, banking, taxation, regulatory updates.
- Tone: SEO-optimized, educational, neutral, beginner-to-intermediate friendly, India-context aware.
- Output per draft: title, slug, category, excerpt, full markdown body (~800–1200 words), SEO title, meta description.
- No cover images (image field left empty for editor to add).

## How it works

```text
[pg_cron daily 02:30 IST]
        │
        ▼
[Edge Function: ai-content-agent]
   1. Fetch last 60 days of titles/slugs (edu + research + weekly) → dedupe list
   2. Ask AI to pick 5 fresh topics across domains, distributed across 3 tables
   3. For each topic → generate structured SEO content (AI SDK + Output schema)
   4. Insert as draft into the correct table
   5. Log run summary into ai_agent_runs
```

## Backend changes

**New table: `ai_agent_runs`**
- Tracks each scheduled run: started_at, finished_at, status, drafts_created, errors, model used.
- RLS: managers read; service role writes.

**New edge function: `ai-content-agent`** (`verify_jwt = false`, invoked by cron + manual CMS button)
- Uses Lovable AI Gateway via the standard `createLovableAiGatewayProvider` helper.
- Model: `google/gemini-3-flash-preview`.
- Two-step pipeline:
  1. **Topic planner** — `generateText` with `Output.object` returning `{ topics: [{ table, category, title, angle }] x5 }`. Prompt includes the recent-titles list so the model avoids overlap.
  2. **Writer** — for each topic, `generateText` with `Output.object` returning `{ title, slug, category, excerpt, body_markdown, seo_title, seo_description }`. Slug auto-fallback to slugified title.
- Inserts:
  - `educational_posts` → status `draft`, author_id null.
  - `research_articles` → status `draft`, publish_date null, tags/references arrays empty.
  - `weekly_reads` → status `draft`, section = "Insights" (or matching enum), heading + body.

**Cron schedule** (via `pg_cron` + `pg_net`, inserted with insert tool, not migration, since it carries the project URL/anon key):
- Daily at 02:30 IST (21:00 UTC).
- Calls the edge function with `{ trigger: "cron" }`.

## CMS changes

**New page: `/admin/ai-agent`** (`src/pages/admin/AIAgentCMS.tsx`)
- "Run now" button → invokes the edge function manually (still saves drafts only).
- Shows last 20 runs from `ai_agent_runs` with status, count, timestamp, errors.
- Quick links to draft-filtered views of each target CMS.
- Nav entry added to `AdminLayout`.

No changes to existing CMS list screens — generated drafts simply appear in the existing Education / Research / Weekly Reads tables with status `draft`, where editors approve/publish exactly as today.

## SEO quality controls (built into the writer prompt)

- Single H1 = title; clear H2/H3 structure.
- 50–60 char SEO title, 140–155 char meta description.
- Keyword-rich but natural; India context where relevant.
- Includes a short intro, structured sections, key takeaways, and an FAQ block (3 Q&As) for rich-result eligibility.
- Excerpt 140–180 chars used as card preview.

## Safety & cost

- All output goes to `draft` — editor approval gates everything.
- Duplicate guard: agent receives last 60 days of titles/slugs and is instructed to skip overlapping topics.
- Rate-limit & credit errors (`429`, `402`) surfaced into `ai_agent_runs.errors`.
- Volume cap: 5 drafts/day, ~10–15 model calls — modest cost.

## Files

**New**
- `supabase/migrations/<ts>_ai_agent_runs.sql` — `ai_agent_runs` table + GRANTs + RLS.
- `supabase/functions/ai-content-agent/index.ts` — agent logic.
- `supabase/functions/_shared/ai-gateway.ts` — Lovable AI Gateway provider helper (if not present).
- `src/pages/admin/AIAgentCMS.tsx` — admin UI.

**Edited**
- `src/pages/admin/AdminLayout.tsx` — add "AI Agent" nav link.
- `src/App.tsx` — register `/admin/ai-agent` route.

## Out of scope (for this build)

- Cover image generation.
- Auto-publish flows.
- Chat-style interaction with the agent.
- Editing the existing Education/Research/Weekly CMS list views.
