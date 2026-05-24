ALTER TABLE public.macro_snapshot ADD COLUMN IF NOT EXISTS sentiment text NOT NULL DEFAULT 'neutral';
ALTER TABLE public.country_indicators ADD COLUMN IF NOT EXISTS sentiment text NOT NULL DEFAULT 'neutral';
ALTER TABLE public.interest_rates ADD COLUMN IF NOT EXISTS interest_rate_sentiment text NOT NULL DEFAULT 'neutral';
ALTER TABLE public.interest_rates ADD COLUMN IF NOT EXISTS bond_yield_sentiment text NOT NULL DEFAULT 'neutral';