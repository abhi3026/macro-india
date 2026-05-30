# Educational hub restructure + foundational content

## 1. URL structure (both routes work)

- New canonical: `/education/:category/:slug` (e.g. `/education/macroeconomics/gdp`)
- New index: `/education/:category` (e.g. `/education/macroeconomics`)
- Old `/education/:slug` keeps working — when hit, looks up post and renders the same page. Canonical tag points to the new category URL so SEO consolidates there.
- Research stays flat: `/research/:slug` (unchanged).
- Category slug derived from `category` field, lowercased + hyphenated (e.g. "Monetary Policy" → `monetary-policy`).
- Sitemap updated to emit new category URLs + new post URLs.

## 2. Educational post page (long-form template)

Upgrade `EducationalPostPage` to a structured learning template. When a post body uses the standard H2 sections below, they render with anchored TOC, breadcrumbs, and FAQ schema. Sections we standardize on:

- What it is (definition)
- How it is calculated (formula / methodology)
- Why it matters for investors
- India context
- Common misconceptions
- Key takeaways
- FAQs

Page adds:
- Breadcrumb: Home › Education › {Category} › {Title} (with `BreadcrumbList` JSON-LD)
- Sticky in-page TOC (desktop)
- `Article` + `FAQPage` JSON-LD (FAQ extracted from H2 "FAQs" section)
- Related posts in same category at the bottom

## 3. Per-post SEO

Each post already has `seo_title`, `seo_description`, `og_image`, `canonical_url` columns. Wire them through:
- `SEOHead` fed from those fields (fallback to title/excerpt).
- Canonical = `/education/:category/:slug` (new URL) regardless of which route the user landed on.
- Open Graph `article:section` = category, `article:published_time` from `published_at`.

## 4. Category index page (`/education/:category`)

- Auto-lists all published posts in that category.
- Each category has an editable intro (title override + markdown blurb) stored in a new `education_categories` table. If no row exists, page renders with sensible defaults.
- New CMS screen `/admin/education-categories` to edit intros + display order.
- Hero, search-within-category, card grid using existing `BlogPostCard`.

## 5. Card design on `/education`

Keep the existing grid but:
- Group by category with section headers linking to `/education/:category`
- Each card shows category badge, reading time, excerpt — clicks go to new URL.

## 6. Seed foundational drafts (~12 topics)

Trigger the AI agent with a curated topic list instead of autonomous selection. One-time CMS button on `/admin/ai-agent` → "Seed foundational basics". Topics:

Macroeconomics: GDP, CPI Inflation, WPI Inflation, Repo Rate, Fiscal Deficit, Current Account Deficit
Markets: P/E Ratio, Bond Yields, Nifty 50, Index Funds
Personal finance/MF: Mutual Funds (basics), SIP, NAV, ELSS

Each generated as a long-form (1200–1800 word) educational draft using the standardized section template above. Saved as `draft` in `educational_posts`. Editor reviews and publishes.

## 7. Files

**New**
- `src/pages/EducationCategoryPage.tsx` — category index
- `src/pages/admin/EducationCategoriesCMS.tsx` — edit intros
- Migration: `education_categories` table (slug PK, title, intro_markdown, display_order)

**Edited**
- `src/App.tsx` — add `/education/:category` and `/education/:category/:slug` routes
- `src/pages/EducationalPostPage.tsx` — long-form template, breadcrumbs, TOC, FAQ schema, SEO from CMS fields, canonical → new URL
- `src/pages/EducationPage.tsx` — group by category, link to new URLs
- `src/components/BlogPostCard.tsx` — minor: category-aware link if needed
- `src/utils/contentLoader.ts` — return seo fields + category slug helper
- `src/pages/admin/AdminLayout.tsx` — nav entry for category CMS
- `src/pages/admin/AIAgentCMS.tsx` — "Seed foundational basics" button
- `supabase/functions/ai-content-agent/index.ts` — accept `{ trigger: "seed_basics", topics: [...] }` and use the long-form prompt template
- `public/sitemap.xml` — note: dynamic posts not listed yet; add static category URLs

**Out of scope**
- Auto-generating sitemap from DB (separate task)
- Migrating research to category URLs (user opted out)
- Cover images for seeded drafts (user opted out earlier)

## Order of execution

1. Migration: `education_categories` table
2. Routes + EducationCategoryPage + updated EducationalPostPage
3. Category CMS page + nav entry
4. AI agent: seed-basics mode + button on agent CMS
5. Trigger seed run (user clicks; produces 12 drafts in review queue)