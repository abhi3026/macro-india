Plan:

1. Restore hero text visibility
   - Update the hero section to use a dedicated white-on-navy hero text token instead of `text-primary-foreground`, because dark mode currently makes `primary-foreground` dark.
   - Keep the existing navy hero background and make all hero copy, metadata, source labels, and outline button text readable again.

2. Fix the AI content agent non-2xx error
   - Remove the direct Gemini API path from `ai-content-agent` completely: no `GEMINI_API_KEY`, no Gemini model loop, no Google direct endpoint fallback.
   - Replace the current raw Lovable AI call, which is using the wrong gateway auth header shape, with the supported Lovable AI Gateway pattern using `LOVABLE_API_KEY`, `Lovable-API-Key`, and `X-Lovable-AIG-SDK`.
   - Use the current default model `google/gemini-3-flash-preview` through Lovable AI.
   - Generate structured JSON more reliably, then validate/repair locally where possible so malformed JSON does not fail the whole run.
   - Keep the existing background-run behaviour: function returns `202` quickly and the run details table shows per-topic success/failure.
   - Remove TinyFish remnants if any remain in code/config/secrets, since macro scraping no longer needs TinyFish.
   - Deploy and test the edge function after edits, then check recent run records/logs.

3. Explain and fix search visibility blockers
   - Your site likely is not appearing for “Indianmacro” because metadata is split across domains: current sitemap/robots and runtime SEO point at the Lovable app domain while the production custom domain is `https://www.indianmacro.com`.
   - Google also needs time after verification, publishing, sitemap updates, and crawl requests; brand-name ranking is not instant even when the site is technically correct.
   - I’ll align canonical URLs, Open Graph URLs, sitemap URLs, robots sitemap directive, JSON-LD, and Google Search Console-facing metadata to the production domain.

4. Fix SEO & AI search findings from the current scan
   - Fix failing canonical/social preview findings by changing `SEOHead` base URL to `https://www.indianmacro.com`.
   - Update `scripts/generate-sitemap.ts`, `public/sitemap.xml`, and `public/robots.txt` to use the production custom domain.
   - Resolve sitemap mismatch by only listing indexable public routes; keep `/admin`, `/auth`, and `/search` out of the sitemap because they are intentionally blocked/non-indexable, and mark that finding fixed with an explanation.
   - Add/verify accessible names and alt text in the flagged components: `BlogPostCard`, `ResearchCard`, `MarketPostPage`, and `ImageUpload`.
   - Fix the contrast/performance findings tied to hero text and font loading.
   - Mark addressed SEO findings as fixed in the SEO panel so the next scan can re-check them.

5. Verification
   - Test `ai-content-agent` through the backend function endpoint.
   - Check recent AI run rows for successful start and clearer error reporting if generation later fails.
   - Trigger or recommend a fresh SEO scan after the code fixes; publishing is required for Google and Lighthouse to see the changes.