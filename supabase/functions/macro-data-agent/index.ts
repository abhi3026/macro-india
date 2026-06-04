// Macro Data Agent — refreshes macro_snapshot, country_indicators, interest_rates
// daily using Lovable AI Gateway (Gemini) with Google Search grounding.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "google/gemini-2.5-flash";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

type AiRow = {
  key: string;
  current: number | null;
  previous?: number | null;
  period?: string | null;
  source?: string | null;
  source_url?: string | null;
};

async function callAI(systemPrompt: string, userPrompt: string): Promise<AiRow[]> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  }
  const rows: AiRow[] = parsed.rows || parsed.data || [];
  return Array.isArray(rows) ? rows : [];
}

function sentimentOf(curr: number | null, prev: number | null, higherIsBetter: boolean | null): "positive" | "negative" | "neutral" {
  if (curr == null || prev == null || higherIsBetter == null) return "neutral";
  if (curr === prev) return "neutral";
  const up = curr > prev;
  return (up && higherIsBetter) || (!up && !higherIsBetter) ? "positive" : "negative";
}

function fmtDelta(curr: number | null, prev: number | null, unit?: string | null): string {
  if (curr == null || prev == null) return "";
  const diff = curr - prev;
  const sign = diff > 0 ? "+" : "";
  const u = unit === "%" ? " pp" : "";
  return `${sign}${diff.toFixed(2)}${u}`;
}

// ---------- Macro Snapshot (India at a glance) ----------
async function refreshMacroSnapshot(details: any[]) {
  const { data: rows } = await supabase.from("macro_snapshot").select("*").order("display_order");
  if (!rows?.length) return 0;
  const labels = rows.map((r: any) => r.label);
  const ai = await callAI(
    "You are a macroeconomic data assistant for India. Return ONLY strict JSON in shape { rows: [{ key, current, previous, period, source, source_url }] }. `current` and `previous` MUST be numbers (no units, no %). For Forex Reserves return USD in billions (e.g. 642.3). For G-Sec/Repo return percent (e.g. 6.5). Use most recent published value as `current` and the prior period as `previous`. If unknown, return null.",
    `Return latest India values for these labels (use the exact label as the key): ${JSON.stringify(labels)}.`
  );
  let updated = 0;
  for (const row of rows) {
    const a = ai.find((x) => x.key?.toLowerCase().trim() === row.label.toLowerCase().trim());
    if (!a || a.current == null) {
      details.push({ table: "macro_snapshot", label: row.label, skipped: "no value" });
      continue;
    }
    const isPct = /%|rate|inflation|growth|gdp|g-sec/i.test(row.label);
    const isUsdB = /forex|reserve/i.test(row.label);
    const value = isUsdB ? `$${a.current.toFixed(0)}B` : isPct ? `${a.current.toFixed(2)}%` : String(a.current);
    const trend: "up" | "down" | "flat" = a.previous == null || a.current === a.previous ? "flat" : a.current > a.previous ? "up" : "down";
    const higherIsBetter = /forex|gdp|growth/i.test(row.label) ? true : /inflation/i.test(row.label) ? false : null;
    const sentiment = sentimentOf(a.current, a.previous ?? null, higherIsBetter);
    const delta = a.previous == null
      ? "Unchanged"
      : isUsdB
        ? `${a.current - a.previous >= 0 ? "+" : ""}$${(a.current - a.previous).toFixed(1)}B`
        : `${a.current - a.previous >= 0 ? "+" : ""}${(a.current - a.previous).toFixed(2)} pp`;
    const { error } = await supabase.from("macro_snapshot")
      .update({ value, delta, trend, sentiment, context: a.period ?? row.context, status: "published", updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) details.push({ table: "macro_snapshot", label: row.label, error: error.message });
    else { updated++; details.push({ table: "macro_snapshot", label: row.label, value }); }
  }
  return updated;
}

// ---------- Country Indicators ----------
async function refreshCountryIndicators(details: any[]) {
  const [{ data: countries }, { data: defs }] = await Promise.all([
    supabase.from("countries").select("code,name"),
    supabase.from("indicator_definitions").select("*"),
  ]);
  if (!countries?.length || !defs?.length) return 0;
  let updated = 0;
  for (const c of countries) {
    const keys = defs.map((d: any) => d.key);
    const ai = await callAI(
      `You are an economic data assistant. Return ONLY strict JSON { rows: [{ key, current, previous, period, source, source_url }] }. All values numeric, no units. Use most recent published official value.`,
      `Country: ${c.name} (${c.code}). Return latest values for indicators (use these exact keys): ${JSON.stringify(keys)}. Labels for context: ${JSON.stringify(defs.map((d: any) => ({ key: d.key, label: d.label, unit: d.unit })))}.`
    ).catch((e) => { details.push({ table: "country_indicators", country: c.code, error: String(e).slice(0, 200) }); return [] as AiRow[]; });
    for (const def of defs as any[]) {
      const a = ai.find((x) => x.key === def.key);
      if (!a || a.current == null) continue;
      const sentiment = sentimentOf(a.current, a.previous ?? null, def.higher_is_better);
      const row = {
        country_code: c.code,
        indicator_key: def.key,
        current_value: a.current,
        previous_value: a.previous ?? null,
        period_label: a.period ?? null,
        source: a.source ?? null,
        source_url: a.source_url ?? null,
        sentiment,
        status: "published",
        last_updated: new Date().toISOString(),
      };
      const { error } = await supabase.from("country_indicators")
        .upsert(row, { onConflict: "country_code,indicator_key" });
      if (error) details.push({ table: "country_indicators", country: c.code, key: def.key, error: error.message });
      else updated++;
    }
  }
  return updated;
}

// ---------- Interest Rates & Bonds ----------
async function refreshInterestRates(details: any[]) {
  const { data: countries } = await supabase.from("countries").select("code,name");
  if (!countries?.length) return 0;
  const ai = await callAI(
    `You are a central bank / bond market data assistant. Return ONLY strict JSON { rows: [{ key, interest_rate, interest_rate_previous, bond_yield, bond_yield_previous, source_url }] } where key is the ISO country code. Values are numeric percents (no % sign). interest_rate = current policy rate. bond_yield = latest 10Y government bond yield.`,
    `Return latest policy rate and 10Y bond yield for: ${JSON.stringify(countries.map((c: any) => ({ code: c.code, name: c.name })))}.`
  );
  let updated = 0;
  for (const c of countries) {
    const a: any = ai.find((x: any) => x.key === c.code);
    if (!a) continue;
    const ir = typeof a.interest_rate === "number" ? a.interest_rate : null;
    const irPrev = typeof a.interest_rate_previous === "number" ? a.interest_rate_previous : null;
    const by = typeof a.bond_yield === "number" ? a.bond_yield : null;
    const byPrev = typeof a.bond_yield_previous === "number" ? a.bond_yield_previous : null;
    if (ir == null && by == null) continue;
    // For interest rates, lower is generally pro-growth (we treat as neutral baseline);
    // sentiment indicates direction: cut = positive (easing), hike = negative (tightening) — heuristic.
    const irSent = ir == null || irPrev == null ? "neutral" : ir < irPrev ? "positive" : ir > irPrev ? "negative" : "neutral";
    const bySent = by == null || byPrev == null ? "neutral" : by < byPrev ? "positive" : by > byPrev ? "negative" : "neutral";
    const today = new Date().toISOString().slice(0, 10);
    const row: any = {
      country_code: c.code,
      status: "published",
    };
    if (ir != null) { row.interest_rate = ir; row.interest_rate_change = irPrev != null ? ir - irPrev : null; row.interest_rate_updated = today; row.interest_rate_sentiment = irSent; }
    if (by != null) { row.bond_yield = by; row.bond_yield_change = byPrev != null ? by - byPrev : null; row.bond_yield_updated = today; row.bond_yield_sentiment = bySent; }
    const { error } = await supabase.from("interest_rates").upsert(row, { onConflict: "country_code" });
    if (error) details.push({ table: "interest_rates", country: c.code, error: error.message });
    else { updated++; details.push({ table: "interest_rates", country: c.code, ir, by }); }
  }
  return updated;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const trigger = body?.trigger ?? "manual";

  const { data: run } = await supabase.from("macro_agent_runs")
    .insert({ trigger, status: "running" }).select().single();
  const runId = run?.id;
  const details: any[] = [];

  try {
    const a = await refreshMacroSnapshot(details);
    const b = await refreshCountryIndicators(details);
    const c = await refreshInterestRates(details);
    const total = a + b + c;
    if (runId) await supabase.from("macro_agent_runs").update({
      status: "succeeded", rows_updated: total, finished_at: new Date().toISOString(), details,
    }).eq("id", runId);
    return new Response(JSON.stringify({ ok: true, rows_updated: total, breakdown: { macro_snapshot: a, country_indicators: b, interest_rates: c } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    if (runId) await supabase.from("macro_agent_runs").update({
      status: "failed", error: msg, finished_at: new Date().toISOString(), details,
    }).eq("id", runId);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
