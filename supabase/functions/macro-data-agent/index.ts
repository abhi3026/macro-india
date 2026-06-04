// Macro Data Agent — background refresh of macro_snapshot, country_indicators,
// interest_rates using Lovable AI Gateway (Gemini). Returns immediately with a
// run id; heavy work runs via EdgeRuntime.waitUntil so the request doesn't hit
// the 150s gateway timeout.
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
  key?: string;
  code?: string;
  current?: number | null;
  previous?: number | null;
  period?: string | null;
  source?: string | null;
  source_url?: string | null;
  [k: string]: any;
};

async function callAI(systemPrompt: string, userPrompt: string): Promise<any> {
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
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

async function callAIRows(system: string, user: string): Promise<AiRow[]> {
  const parsed = await callAI(system, user);
  const rows = parsed.rows || parsed.data || [];
  return Array.isArray(rows) ? rows : [];
}

function sentimentOf(curr: number | null, prev: number | null, higherIsBetter: boolean | null): "positive" | "negative" | "neutral" {
  if (curr == null || prev == null || higherIsBetter == null) return "neutral";
  if (curr === prev) return "neutral";
  const up = curr > prev;
  return (up && higherIsBetter) || (!up && !higherIsBetter) ? "positive" : "negative";
}

function trendOf(curr: number | null, prev: number | null): "up" | "down" | "flat" {
  if (curr == null || prev == null || curr === prev) return "flat";
  return curr > prev ? "up" : "down";
}

// Run array of async tasks with bounded concurrency
async function pMap<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      try { results[i] = await fn(items[i], i); } catch (e) { results[i] = e as any; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ---------- Macro Snapshot ----------
async function refreshMacroSnapshot(details: any[]): Promise<number> {
  const { data: rows } = await supabase.from("macro_snapshot").select("*").order("display_order");
  if (!rows?.length) return 0;
  const labels = rows.map((r: any) => r.label);
  const ai = await callAIRows(
    "You are a macroeconomic data assistant for India. Return ONLY strict JSON in shape { rows: [{ key, current, previous, period, source, source_url }] }. `current` and `previous` MUST be numbers (no units, no %). For Forex Reserves return USD in billions (e.g. 642.3). For G-Sec/Repo return percent (e.g. 6.5). Use most recent published value as `current` and the prior period as `previous`. If unknown, return null.",
    `Return latest India values for these labels (use the exact label as the key): ${JSON.stringify(labels)}.`
  );
  let updated = 0;
  for (const row of rows) {
    const a = ai.find((x) => (x.key ?? "").toLowerCase().trim() === row.label.toLowerCase().trim());
    if (!a || a.current == null) { details.push({ table: "macro_snapshot", label: row.label, skipped: "no value" }); continue; }
    const isPct = /%|rate|inflation|growth|gdp|g-sec/i.test(row.label);
    const isUsdB = /forex|reserve/i.test(row.label);
    const value = isUsdB ? `$${a.current.toFixed(0)}B` : isPct ? `${a.current.toFixed(2)}%` : String(a.current);
    const trend = trendOf(a.current, a.previous ?? null);
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
    else { updated++; details.push({ table: "macro_snapshot", label: row.label, value, trend, sentiment }); }
  }
  return updated;
}

// ---------- Country Indicators (batched by country group + parallel) ----------
async function refreshCountryIndicators(details: any[]): Promise<number> {
  const [{ data: countries }, { data: defs }] = await Promise.all([
    supabase.from("countries").select("code,name"),
    supabase.from("indicator_definitions").select("*"),
  ]);
  if (!countries?.length || !defs?.length) return 0;

  // Batch countries to cut total AI calls (~196 -> ~20)
  const BATCH = 10;
  const batches: any[][] = [];
  for (let i = 0; i < countries.length; i += BATCH) batches.push(countries.slice(i, i + BATCH));

  let updated = 0;
  await pMap(batches, 4, async (batch) => {
    const ai = await callAI(
      `You are an economic data assistant. Return ONLY strict JSON in shape { countries: [{ code, indicators: [{ key, current, previous, period, source, source_url }] }] }. All values numeric, no units. Use most recent published official value (IMF, World Bank, OECD, central bank).`,
      `Return latest values for these countries: ${JSON.stringify(batch.map((c) => ({ code: c.code, name: c.name })))}.
Indicator keys (use exactly these): ${JSON.stringify(defs.map((d: any) => ({ key: d.key, label: d.label, unit: d.unit })))}.`
    ).catch((e) => { details.push({ table: "country_indicators", batch: batch.map((c) => c.code), error: String(e).slice(0, 200) }); return null; });
    if (!ai) return;
    const list = Array.isArray(ai.countries) ? ai.countries : [];
    for (const c of batch) {
      const entry = list.find((x: any) => (x.code ?? "").toUpperCase() === c.code.toUpperCase());
      if (!entry || !Array.isArray(entry.indicators)) continue;
      for (const def of defs as any[]) {
        const a = entry.indicators.find((x: any) => x.key === def.key);
        if (!a || a.current == null) continue;
        const sentiment = sentimentOf(a.current, a.previous ?? null, def.higher_is_better);
        const trend = trendOf(a.current, a.previous ?? null);
        const row = {
          country_code: c.code,
          indicator_key: def.key,
          current_value: a.current,
          previous_value: a.previous ?? null,
          change_value: a.previous != null ? a.current - a.previous : null,
          trend,
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
  });
  return updated;
}

// ---------- Interest Rates & Bonds ----------
async function refreshInterestRates(details: any[]): Promise<number> {
  const { data: countries } = await supabase.from("countries").select("code,name");
  if (!countries?.length) return 0;

  // Batch into chunks so the model returns a manageable JSON per call
  const BATCH = 40;
  const batches: any[][] = [];
  for (let i = 0; i < countries.length; i += BATCH) batches.push(countries.slice(i, i + BATCH));

  let updated = 0;
  await pMap(batches, 3, async (batch) => {
    const ai = await callAIRows(
      `You are a central bank / bond market data assistant. Return ONLY strict JSON { rows: [{ key, interest_rate, interest_rate_previous, bond_yield, bond_yield_previous, source_url }] } where key is the ISO country code. Numeric percents only (no % sign). interest_rate = current policy rate. bond_yield = latest 10Y government bond yield.`,
      `Return latest policy rate and 10Y bond yield for: ${JSON.stringify(batch.map((c) => ({ code: c.code, name: c.name })))}.`
    ).catch((e) => { details.push({ table: "interest_rates", batch: batch.map((c) => c.code), error: String(e).slice(0, 200) }); return [] as AiRow[]; });

    for (const c of batch) {
      const a: any = ai.find((x: any) => (x.key ?? "").toUpperCase() === c.code.toUpperCase());
      if (!a) continue;
      const ir = typeof a.interest_rate === "number" ? a.interest_rate : null;
      const irPrev = typeof a.interest_rate_previous === "number" ? a.interest_rate_previous : null;
      const by = typeof a.bond_yield === "number" ? a.bond_yield : null;
      const byPrev = typeof a.bond_yield_previous === "number" ? a.bond_yield_previous : null;
      if (ir == null && by == null) continue;
      const irSent = ir == null || irPrev == null ? "neutral" : ir < irPrev ? "positive" : ir > irPrev ? "negative" : "neutral";
      const bySent = by == null || byPrev == null ? "neutral" : by < byPrev ? "positive" : by > byPrev ? "negative" : "neutral";
      const irTrend = trendOf(ir, irPrev);
      const byTrend = trendOf(by, byPrev);
      const today = new Date().toISOString().slice(0, 10);
      const row: any = { country_code: c.code, status: "published" };
      if (ir != null) {
        row.interest_rate = ir;
        row.interest_rate_change = irPrev != null ? ir - irPrev : null;
        row.interest_rate_updated = today;
        row.interest_rate_sentiment = irSent;
        row.interest_rate_trend = irTrend;
      }
      if (by != null) {
        row.bond_yield = by;
        row.bond_yield_change = byPrev != null ? by - byPrev : null;
        row.bond_yield_updated = today;
        row.bond_yield_sentiment = bySent;
        row.bond_yield_trend = byTrend;
      }
      const { error } = await supabase.from("interest_rates").upsert(row, { onConflict: "country_code" });
      if (error) details.push({ table: "interest_rates", country: c.code, error: error.message });
      else { updated++; details.push({ table: "interest_rates", country: c.code, ir, by, irTrend, byTrend }); }
    }
  });
  return updated;
}

async function runJob(runId: string, trigger: string) {
  const details: any[] = [];
  try {
    const a = await refreshMacroSnapshot(details);
    const c = await refreshInterestRates(details);
    const b = await refreshCountryIndicators(details);
    const total = a + b + c;
    await supabase.from("macro_agent_runs").update({
      status: "succeeded", rows_updated: total, finished_at: new Date().toISOString(),
      details: { breakdown: { macro_snapshot: a, country_indicators: b, interest_rates: c }, items: details.slice(0, 500) },
    }).eq("id", runId);
  } catch (e: any) {
    await supabase.from("macro_agent_runs").update({
      status: "failed", error: String(e?.message ?? e), finished_at: new Date().toISOString(),
      details: { items: details.slice(0, 500) },
    }).eq("id", runId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const trigger = body?.trigger ?? "manual";

  const { data: run, error } = await supabase.from("macro_agent_runs")
    .insert({ trigger, status: "running" }).select().single();
  if (error || !run) {
    return new Response(JSON.stringify({ ok: false, error: error?.message ?? "insert failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Kick off the heavy work in the background, then return immediately.
  // @ts-ignore EdgeRuntime is provided by the Supabase edge runtime
  EdgeRuntime.waitUntil(runJob(run.id, trigger));

  return new Response(JSON.stringify({ ok: true, runId: run.id, status: "running", note: "Refresh started in background. Watch Recent macro runs." }), {
    status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
