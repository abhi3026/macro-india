CREATE TABLE public.education_categories (
  slug TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  intro_markdown TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 1000,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.education_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education_categories TO authenticated;
GRANT ALL ON public.education_categories TO service_role;

ALTER TABLE public.education_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read education categories"
ON public.education_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "manage write education categories"
ON public.education_categories
FOR ALL
TO authenticated
USING (private.can_manage(auth.uid()))
WITH CHECK (private.can_manage(auth.uid()));

CREATE TRIGGER update_education_categories_updated_at
BEFORE UPDATE ON public.education_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.education_categories (slug, title, intro_markdown, display_order) VALUES
  ('macroeconomics', 'Macroeconomics', 'Understand the forces that move the Indian and global economy — GDP, inflation, interest rates, fiscal and monetary policy — and what they mean for your investments.', 10),
  ('financial-markets', 'Financial Markets', 'Learn how Indian and global equity, debt, and commodity markets work, from indices and valuations to bond yields and market microstructure.', 20),
  ('indian-economy', 'Indian Economy', 'Sector-by-sector explainers on India''s economy: banking, manufacturing, services, agriculture, trade, and demographics.', 30),
  ('monetary-policy', 'Monetary Policy', 'How the RBI uses tools like the repo rate, CRR, and OMOs to steer inflation, growth, and the rupee.', 40),
  ('fiscal-policy', 'Fiscal Policy', 'Government spending, taxation, deficits, and debt — and how Budget choices ripple through markets.', 50),
  ('global-trade', 'Global Trade', 'Trade balances, tariffs, supply chains, and FX — the global flows that shape India''s economy.', 60),
  ('development-economics', 'Development Economics', 'Long-run drivers of prosperity: productivity, human capital, infrastructure, and institutions.', 70),
  ('investing-basics', 'Investing Basics', 'Foundational concepts for every Indian investor — mutual funds, SIPs, NAV, ELSS, asset allocation, and risk.', 80)
ON CONFLICT (slug) DO NOTHING;