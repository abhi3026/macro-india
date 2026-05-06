
# Institutional Redesign — Phase 2

Bring Navbar, Homepage hero stack, Dashboard, and Research pages up to the same Bloomberg/Economist-grade standard as the FeaturedResearch + Footer work already shipped. All work uses existing design tokens (navy `--primary` #000041, sapphire `--brand`, `font-display` Fraunces, `tabular-nums`, `surface`, `hero-bg`).

---

## 1. Navbar (`src/components/Navbar.tsx`)

Premium two-row structure with command-bar feel.

- **Top utility strip** (hidden < md): live IST clock, market open/closed pill (NSE session), tiny `INR/USD · 10Y G-Sec · NIFTY` mini-tickers, theme toggle.
- **Main bar**: monogram + wordmark "IndianMacro" with `font-display` and a subtle "Research" tag pill; primary nav becomes hover-underline links with active-route indicator (sapphire underline).
- **Search**: ⌘K-style search button (not always-open input) opening a Command palette using existing `command.tsx` — searches research/markets/pages. Falls back to `/search?q=`.
- **CTA**: replace generic "Subscribe" with two-tier `Sign in` (ghost) + `Get research` (primary sapphire). Subscribe modal stays.
- **Mobile**: full-screen sheet (use `sheet.tsx`) instead of accordion; sectioned nav with descriptions, search at top, CTA pinned bottom.
- **Scroll behavior**: shrinks from 80px → 56px on scroll, border softens, backdrop blur intensifies.

## 2. Homepage Hero (`src/components/HeroSection.tsx`)

Keep navy bg + bold white type (per memory) but elevate composition.

- **Eyebrow**: "INDIA · MACRO INTELLIGENCE" with live updated date.
- **Headline**: refined hierarchy — `font-display` 48–80px, single accent gradient word ("India's economy").
- **Right-side visual**: faint inline SVG of an upward GDP curve + 3 floating "card chips" (CPI, Repo Rate, NIFTY) with mock live values + spark deltas. On mobile this collapses below copy.
- **Proof bar** below: replace the 3-stat grid with a horizontal logo/source row (RBI · MOSPI · SEBI · NSE · World Bank) in white/40 opacity — institutional trust signal.
- **Dual CTA** preserved; secondary becomes "View live indicators" anchor link.
- Subtle animated grid + radial glow already present; tune opacity.

## 3. Dashboard Page (`src/pages/DashboardPage.tsx`)

Currently uses old `bg-indianmacro-800` + `bg-white`. Rebuild to match the new system.

- **Hero**: replace with `PageHero` component (consistent with Research page). Adds breadcrumb + last-refresh meta.
- **KPI strip**: above tabs, add 4 hero KPI tiles (GDP, CPI, Repo, NIFTY) with value, delta chip (gain/loss colors), 30-day sparkline.
- **Tabs**: keep Economic / Markets, add a third "FX & Rates" tab; tab triggers restyled as pill underline.
- **Widgets**: wrap each `DataWidget` in `surface` class for consistent card chrome; add source attribution + "as of" timestamp footer to each card.
- **External sources**: redesigned as compact `surface` link cards with tiny logo monogram, hover shows arrow.
- **TradingView placeholder**: replace with actual `TradingViewNewsWidget` or proper market overview embed using existing `tradingViewLoader`.
- **Refresh control**: moved into the KPI strip with relative time ("Updated 2 min ago").
- Background switches from hard-coded `bg-white` to `bg-background` so dark mode works.

## 4. Research Page (`src/pages/ResearchPage.tsx`)

Today it's hard-coded 3 cards with no real content. Convert to a research index.

- **Header**: keep `PageHero` but enrich with subtitle + tag chips (Macro · Policy · Markets · Sectors).
- **Toolbar**: search input, category filter pills, sort dropdown (Newest / Most read), view toggle (grid/list).
- **Featured strip**: 1 large editor's pick card (image left, headline right) + 2 secondary cards.
- **Grid**: use existing `ResearchCard` component, pulling from `contentLoader` (`content/research`). Empty state if none.
- **Sidebar (lg)**: "Latest insights" list, newsletter mini-signup (Buttondown), and "Methodology" link.
- **Pagination/Load more** at bottom.

---

## Technical notes

- Reuse existing components: `surface` utility, `PageHero`, `ResearchCard`, `ThemeToggle`, `Sheet`, `Command`, `Tabs`, `Badge`. No new deps.
- Respect memories: navy hero bg + white text preserved; theme persists via existing `ThemeProvider`; TradingView via `tradingViewLoader.ts`; newsletter still uses `subscribeToNewsletter` (Buttondown).
- All new typography uses `font-display` for headings, `tabular-nums` for any numeric data.
- Keep all changes responsive-first (test at 375 / 768 / 1280); mobile menu becomes Sheet.
- No backend changes; KPI sparkline data uses small inline mock array (or `marketData.ts` if values exist) clearly marked for future API swap.
- Build must remain green — avoid removing exports used by other pages.

---

## Files to be edited

```text
src/components/Navbar.tsx          rebuilt
src/components/HeroSection.tsx     rebuilt with chips + sources
src/pages/DashboardPage.tsx        rebuilt with PageHero + KPI strip
src/pages/ResearchPage.tsx         rebuilt as research index
src/components/ui/page-hero.tsx    minor: support eyebrow + breadcrumb props
```

No files deleted. No routing changes.
