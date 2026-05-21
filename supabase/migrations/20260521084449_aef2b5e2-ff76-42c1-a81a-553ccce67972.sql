
CREATE TABLE public.interest_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL UNIQUE,
  interest_rate numeric,
  interest_rate_change numeric,
  interest_rate_updated date,
  bond_yield numeric,
  bond_yield_change numeric,
  bond_yield_updated date,
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.interest_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published interest rates"
  ON public.interest_rates FOR SELECT
  TO public
  USING (status = 'published'::content_status);

CREATE POLICY "auth read all interest rates"
  ON public.interest_rates FOR SELECT
  TO authenticated
  USING (private.can_manage(auth.uid()));

CREATE POLICY "manage write interest rates"
  ON public.interest_rates FOR ALL
  TO authenticated
  USING (private.can_manage(auth.uid()))
  WITH CHECK (private.can_manage(auth.uid()));

CREATE TRIGGER touch_interest_rates_updated_at
  BEFORE UPDATE ON public.interest_rates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed defaults for existing countries from the homepage tracker
INSERT INTO public.interest_rates (country_code, interest_rate, interest_rate_change, interest_rate_updated, bond_yield, bond_yield_change, bond_yield_updated)
VALUES
  ('in', 6.50, 0, '2024-02-08', 7.12, -0.05, '2024-02-20'),
  ('us', 5.50, 0, '2024-01-31', 4.28, 0.03, '2024-02-20'),
  ('gb', 5.25, 0, '2024-02-01', 4.12, -0.02, '2024-02-20'),
  ('eu', 4.50, 0, '2024-01-25', 2.85, 0.01, '2024-02-20'),
  ('jp', -0.10, 0, '2024-01-23', 0.72, 0.02, '2024-02-20'),
  ('cn', 3.45, -0.25, '2024-02-20', 2.45, -0.03, '2024-02-20')
ON CONFLICT (country_code) DO NOTHING;
