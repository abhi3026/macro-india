import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Country = {
  code: string;
  name: string;
  flag_emoji: string | null;
  flag_url: string | null;
  show_on_homepage: boolean;
  display_order: number;
};

export type IndicatorDef = {
  key: string;
  label: string;
  unit: string | null;
  higher_is_better: boolean | null;
  display_order: number;
  show_on_homepage: boolean;
  show_on_dashboard: boolean;
};

export type CountryIndicator = {
  id: string;
  country_code: string;
  indicator_key: string;
  current_value: number | null;
  previous_value: number | null;
  period_label: string | null;
  source: string | null;
  source_url: string | null;
  notes: string | null;
  status: "draft" | "published" | "pending" | "declined";
  last_updated: string;
};

export type IndicatorView = {
  countries: Country[];
  defs: IndicatorDef[];
  byCountry: Record<string, Record<string, CountryIndicator>>;
};

async function fetchIndicators(opts: { homepageOnly?: boolean; includeDrafts?: boolean }) {
  const [c, d, v] = await Promise.all([
    supabase.from("countries").select("*").order("display_order", { ascending: true }).order("name"),
    supabase.from("indicator_definitions").select("*").order("display_order", { ascending: true }),
    supabase.from("country_indicators").select("*"),
  ]);
  if (c.error) throw c.error;
  if (d.error) throw d.error;
  if (v.error) throw v.error;

  let countries = (c.data ?? []) as Country[];
  let defs = (d.data ?? []) as IndicatorDef[];
  if (opts.homepageOnly) {
    countries = countries.filter(x => x.show_on_homepage);
    defs = defs.filter(x => x.show_on_homepage);
  }

  const byCountry: Record<string, Record<string, CountryIndicator>> = {};
  for (const row of (v.data ?? []) as CountryIndicator[]) {
    if (!opts.includeDrafts && row.status !== "published") continue;
    byCountry[row.country_code] ??= {};
    byCountry[row.country_code][row.indicator_key] = row;
  }
  return { countries, defs, byCountry } as IndicatorView;
}

export function useHomepageIndicators() {
  return useQuery({
    queryKey: ["indicators", "homepage"],
    queryFn: () => fetchIndicators({ homepageOnly: true }),
    staleTime: 60_000,
  });
}

export function useDashboardIndicators() {
  return useQuery({
    queryKey: ["indicators", "dashboard"],
    queryFn: () => fetchIndicators({ homepageOnly: false }),
    staleTime: 60_000,
  });
}

export function useAllIndicatorsAdmin() {
  return useQuery({
    queryKey: ["indicators", "admin"],
    queryFn: () => fetchIndicators({ homepageOnly: false, includeDrafts: true }),
    staleTime: 0,
  });
}

export function diff(curr: number | null | undefined, prev: number | null | undefined): number | null {
  if (curr == null || prev == null) return null;
  return Number((curr - prev).toFixed(2));
}

export function formatValue(value: number | null | undefined, unit: string | null | undefined): string {
  if (value == null) return "—";
  const u = unit ?? "";
  if (u === "%") return `${value.toFixed(1)}%`;
  if (u === "USD bn" || u === "EUR bn") return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${u}`;
  if (u === "points" || u === "") return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${value.toFixed(2)} ${u}`.trim();
}
