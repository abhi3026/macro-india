import { supabase } from "@/integrations/supabase/client";
import type { Country } from "@/lib/countryIndicators";

export interface InterestRateRow {
  id: string;
  country_code: string;
  interest_rate: number | null;
  interest_rate_change: number | null;
  interest_rate_updated: string | null;
  interest_rate_sentiment?: "positive" | "negative" | "neutral" | null;
  bond_yield: number | null;
  bond_yield_change: number | null;
  bond_yield_updated: string | null;
  bond_yield_sentiment?: "positive" | "negative" | "neutral" | null;
  status: string;
}

export interface InterestRatesBundle {
  countries: Country[];
  byCode: Record<string, InterestRateRow>;
}

export async function fetchInterestRatesBundle(opts: { homepageOnly?: boolean } = {}): Promise<InterestRatesBundle> {
  let countriesQuery = supabase
    .from("countries")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  if (opts.homepageOnly) {
    countriesQuery = countriesQuery.eq("show_on_homepage", true) as typeof countriesQuery;
  }

  const [{ data: countries, error: cErr }, { data: rows, error: rErr }] = await Promise.all([
    countriesQuery,
    supabase.from("interest_rates").select("*").eq("status", "published"),
  ]);
  if (cErr) throw cErr;
  if (rErr) throw rErr;

  const byCode: Record<string, InterestRateRow> = {};
  for (const r of (rows ?? []) as InterestRateRow[]) byCode[r.country_code] = r;

  return { countries: (countries ?? []) as Country[], byCode };
}
