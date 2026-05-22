
CREATE TABLE public.macro_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL DEFAULT '',
  delta text NOT NULL DEFAULT '',
  trend text NOT NULL DEFAULT 'flat',
  context text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 1000,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.macro_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published snapshot"
  ON public.macro_snapshot FOR SELECT
  TO public
  USING (status = 'published'::public.content_status);

CREATE POLICY "auth read all snapshot"
  ON public.macro_snapshot FOR SELECT
  TO authenticated
  USING (private.can_manage(auth.uid()));

CREATE POLICY "manage write snapshot"
  ON public.macro_snapshot FOR ALL
  TO authenticated
  USING (private.can_manage(auth.uid()))
  WITH CHECK (private.can_manage(auth.uid()));

CREATE TRIGGER macro_snapshot_touch_updated_at
  BEFORE UPDATE ON public.macro_snapshot
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.macro_snapshot (label, value, delta, trend, context, display_order) VALUES
  ('Real GDP Growth', '7.2%', '+0.3 pp YoY', 'up', 'Above 10-yr avg', 1),
  ('CPI Inflation', '4.5%', '-0.2 pp MoM', 'down', 'Within RBI band', 2),
  ('Repo Rate', '6.50%', 'Unchanged', 'flat', 'On hold since Feb ''23', 3),
  ('10Y G-Sec', '7.14%', '-4 bps WoW', 'down', 'Curve steepening', 4),
  ('USD/INR', '83.02', '-0.24%', 'down', 'RBI defending 83.5', 5),
  ('Forex Reserves', '$642B', '+$2.1B', 'up', 'Near record high', 6);
