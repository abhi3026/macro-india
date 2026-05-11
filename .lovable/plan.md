## Admin CMS Redesign — Institutional Editorial System

This is a large, multi-phase build. Before I start, I need to confirm a few things and lay out the approach.

### What this requires

To build a secure, role-based CMS that dynamically powers the public website, the project needs a real backend (database, authentication, role checks, row-level security). Right now content lives in a static `contentLoader.ts` file with sample data — there is no auth, no database, no protected routes.

I'll enable **Lovable Cloud** (managed Postgres + Auth + Storage) to provide:
- Authenticated admin login (email/password + optional Google)
- `user_roles` table with `admin | editor | analyst | contributor` (separate table, security-definer `has_role()` — no privilege-escalation risk)
- Protected `/admin` routes (redirect non-admins)
- Tables for all content types with RLS
- Storage bucket for featured images

### Database schema

```text
profiles            (id, email, display_name, created_at)
user_roles          (id, user_id, role)              -- enum: admin/editor/analyst/contributor
educational_posts   (id, serial, title, slug, category, body, image, status, seo_*, author_id, dates)
research_articles   (id, serial, title, slug, category, body, featured_image, tags[], references[],
                     publish_date, status, seo_title, seo_description, og_image, canonical, author_id)
economic_indicators (id, serial, indicator, current_value, previous_value, source, last_updated, status)
weekly_reads        (id, serial, section[Policy|Market|Risk], heading, body, image, status)
invitations         (id, email, role, token, invited_by, accepted_at)

status enum: draft | pending | approved | published | declined
```

All tables get RLS:
- Public read: only `status = 'published'`
- Admins/editors: full CRUD via `has_role()`
- Contributors/analysts: insert + edit own drafts

### Admin UI (Bloomberg/FT-inspired)

`/admin` layout with sidebar navigation:
1. **Dashboard** — counts by status, recent activity
2. **Educational Content** — table: `# | Title | Category | Status | Approve | Decline` + search, category filter, sort, pagination, row → editor drawer
3. **Research Articles** — table: `# | Title | Category | Publish Date | Status | Approve | Decline` + rich editor (tiptap), featured image upload, SEO fields, tags, references
4. **Economic Indicators** — editable inline table: `# | Indicator | Current | Previous | Source | Last Updated | Status`
5. **This Week's Read** — table: `# | Section | Heading | Status | Approve | Decline`
6. **Users & Invitations** — admin-only; invite by email, assign role

Approve action sets `status = 'published'` and stamps publish date. Decline sets `status = 'declined'`.

Styling: monospace serial numbers, condensed tables, neutral palette, subtle borders, no cards-around-everything — newsroom feel.

### Public site wiring

Replace static `contentLoader.ts` sample data with Supabase queries:
- `ResearchPage` + homepage `FeaturedResearch` → `research_articles` where `status = 'published'`
- `EducationPage` → `educational_posts` where `status = 'published'`
- Homepage indicators / dashboard → `economic_indicators`
- Homepage editorial strip → `weekly_reads`

### Auth flow

- `/auth` login page (email/password, optional Google)
- `useAuth()` hook with `onAuthStateChange` listener set up before `getSession()`
- `<ProtectedAdminRoute>` checks `has_role(uid, 'admin'|'editor')` server-side
- Invite system: admin sends invite → email with signup link bound to pre-assigned role

### Build phases

1. Enable Lovable Cloud, create schema + RLS + roles + storage bucket
2. Auth pages, `useAuth`, protected route wrapper
3. Admin shell + sidebar + dashboard
4. Educational Content CMS (table + editor)
5. Research Articles CMS (table + rich editor + image upload + SEO)
6. Economic Indicators CMS (inline-edit table)
7. This Week's Read CMS
8. Users & Invitations
9. Wire public pages to live data, remove static fallbacks
10. SEO meta wiring (slug routes, OG images, canonical)

### Questions before I start

1. **Auth methods** — email/password only, or also Google sign-in?
2. **Rich editor** — Tiptap (recommended, lightweight, extensible) okay?
3. **Initial admin** — what email should I seed as the first admin? (Otherwise I'll add a one-time bootstrap: first user to sign up becomes admin.)
4. **Scope of this turn** — this is ~10 phases. Do you want me to ship it all in one go (long run, may take several iterations), or phase 1–4 first (backend + auth + Education CMS) and continue after you verify?

Once you answer, I'll proceed.