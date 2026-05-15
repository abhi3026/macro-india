import { supabase } from "@/integrations/supabase/client";

export interface Country {
  code: string;
  name: string;
  flag_emoji: string | null;
  flag_url: string | null;
  show_on_homepage: boolean;
  display_order: number;
}

export interface IndicatorDef {
  key: string;
  label: string;
  unit: string | null;
  higher_is_better: boolean | null;
  show_on_dashboard: boolean;
  show_on_homepage: boolean;
  display_order: number;
}

export interface CountryIndicator {
  id: string;
  country_code: string;
  indicator_key: string;
  current_value: number | null;
  previous_value: number | null;
  period_label: string | null;
  source: string | null;
  source_url: string | null;
  status: string;
  last_updated: string;
}

export type IndicatorMatrix = Record<string, Record<string, CountryIndicator>>; // [country_code][indicator_key]

export function buildMatrix(rows: CountryIndicator[]): IndicatorMatrix {
  const m: IndicatorMatrix = {};
  for (const r of rows) {
    if (!m[r.country_code]) m[r.country_code] = {};
    m[r.country_code][r.indicator_key] = r;
  }
  return m;
}

/** Format a numeric value with optional unit. */
export function formatValue(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  let txt: string;
  if (abs >= 1000) txt = value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  else if (abs >= 100) txt = value.toFixed(1);
  else txt = value.toFixed(2).replace(/\.?0+$/, "");
  return unit ? `${txt} ${unit}`.trim() : txt;
}

/** Compute diff (current - previous). */
export function computeDiff(current: number | null | undefined, previous: number | null | undefined): number | null {
  if (current === null || current === undefined || previous === null || previous === undefined) return null;
  return current - previous;
}

/** Returns "+1.20" / "-0.50" or "—". */
export function formatDiff(diff: number | null): string {
  if (diff === null) return "—";
  const sign = diff > 0 ? "+" : "";
  const abs = Math.abs(diff);
  const txt = abs >= 100 ? diff.toFixed(1) : diff.toFixed(2).replace(/\.?0+$/, "");
  return `${sign}${txt}`;
}

/** Color class for diff: green if "good", red if "bad", muted if zero. higher_is_better null → neutral by sign. */
export function diffColorClass(diff: number | null, higherIsBetter: boolean | null | undefined): string {
  if (diff === null || diff === 0) return "text-muted-foreground";
  const positive = diff > 0;
  if (higherIsBetter === null || higherIsBetter === undefined) {
    return positive ? "text-green-600" : "text-red-600";
  }
  const isGood = higherIsBetter ? positive : !positive;
  return isGood ? "text-green-600" : "text-red-600";
}

/** Fetch published country indicators + countries + defs (public, RLS-friendly). */
export async function fetchIndicatorsBundle(opts: { homepageOnly?: boolean } = {}) {
  const countriesQuery = supabase.from("countries").select("*").order("display_order", { ascending: true }).order("name", { ascending: true });
  if (opts.homepageOnly) countriesQuery.eq("show_on_homepage", true);

  const defsQuery = supabase.from("indicator_definitions").select("*").order("display_order", { ascending: true });
  if (opts.homepageOnly) defsQuery.eq("show_on_homepage", true);

  const [{ data: countries, error: cErr }, { data: defs, error: dErr }, { data: rows, error: rErr }] = await Promise.all([
    countriesQuery,
    defsQuery,
    supabase.from("country_indicators").select("*").eq("status", "published"),
  ]);
  if (cErr) throw cErr;
  if (dErr) throw dErr;
  if (rErr) throw rErr;
  return {
    countries: (countries ?? []) as Country[],
    defs: (defs ?? []) as IndicatorDef[],
    matrix: buildMatrix((rows ?? []) as CountryIndicator[]),
  };
}
