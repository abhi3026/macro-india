
CREATE TABLE IF NOT EXISTS public.macro_agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  trigger text NOT NULL DEFAULT 'cron',
  status text NOT NULL DEFAULT 'running',
  rows_updated integer NOT NULL DEFAULT 0,
  error text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.macro_agent_runs TO authenticated;
GRANT ALL ON public.macro_agent_runs TO service_role;

ALTER TABLE public.macro_agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view macro agent runs"
  ON public.macro_agent_runs FOR SELECT
  TO authenticated
  USING (public.can_manage(auth.uid()));

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
