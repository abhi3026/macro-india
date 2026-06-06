// Macro Data Agent — scrapes Trading Economics country-list pages via the
// TinyFish Agent API and refreshes macro_snapshot, country_indicators, and
// interest_rates. Returns immediately with a runId; work continues in the
// background via EdgeRuntime.waitUntil.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TINYFISH_API_KEY = Deno.env.get("TINYFISH_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// indicator_key -> tradingeconomics country-list slug
const INDICATOR_SLUGS: Record<string, string> = {
  gdp: "gdp",
  gdp_growth: "gdp-growth-annual",
  inflation: "inflation-cpi",
  unemployment: "unemployment-rate",
  pmi: "manufacturing-pmi",
  business_confidence: "business-confidence",
  consumer_confidence: "consumer-confidence",
  exports: "exports",
  forex_reserves: "foreign-exchange-reserves",
  g_sec_10y: "government-bond-10y",
  repo_rate: "interest-rate",
};

// macro_snapshot label -> indicator slug to pick India's row from
const MACRO_LABEL_SLUGS: Record<string, string> = {
  "real gdp growth": "gdp-growth-annual",
  "gdp growth": "gdp-growth-annual",
  "cpi inflation": "inflation-cpi",
  "inflation": "inflation-cpi",
  "repo rate": "interest-rate",
  "10y g-sec": "government-bond-10y",
  "10y bond yield": "government-bond-10y",
  "forex reserves": "foreign-exchange-reserves",
};

type ScrapedRow = { country: string; value: number | null; previous?: number | null };

function normalizeName(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Common name aliases TE → our `countries.name`
const NAME_ALIASES: Record<string, string> = {
  "united states": "united states",
  "usa": "united states",
  "u s a": "united states",
  "u s": "united states",
  "united kingdom": "united kingdom",
  "uk": "united kingdom",
  "great britain": "united kingdom",
  "euro area": "eurozone",
  "south korea": "south korea",
  "korea": "south korea",
  "republic of korea": "south korea",
  "russia": "russia",
  "russian federation": "russia",
  "ivory coast": "ivory coast",
  "cote d ivoire": "ivory coast",
  "czechia": "czech republic",
  "macedonia": "north macedonia",
  "swaziland": "eswatini",
  "burma": "myanmar",
  "cape verde": "cape verde",
  "cabo verde": "cape verde",
  "vatican": "vatican city",
  "holy see": "vatican city",
  "palestine": "palestine",
};

function extractJsonBlock(text: string): any {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();
  try { return JSON.parse(candidate); } catch {}
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(candidate.slice(start, end + 1)); } catch {}
  }
  return null;
}

async function tinyfishScrape(slug: string): Promise<ScrapedRow[]> {
  const url = `https://tradingeconomics.com/country-list/${slug}`;
  const res = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": TINYFISH_API_KEY },
    body: JSON.stringify({
      url,
      goal: "Extract every data row from the main country indicator table on this Trading Economics country-list page. Return ONLY a JSON object of the form: {\"rows\":[{\"country\":string,\"value\":number,\"previous\":number}]}. value is the 'Last' column as a plain number (no units, commas or % sign). previous is the 'Previous' column as a plain number. Skip header/footer/ad rows.",
      browser_profile: "lite",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`TinyFish ${slug} ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  if (data.status !== "COMPLETED") {
    throw new Error(`TinyFish ${slug} status=${data.status}: ${JSON.stringify(data.error ?? {}).slice(0, 300)}`);
  }
  // result can be either: { result: { rows: [...] } }, or { result: { result: "```json...```" } }
  let rows: any = data?.result?.rows;
  if (!Array.isArray(rows)) {
    const inner = data?.result?.result;
    if (typeof inner === "string") {
      const parsed = extractJsonBlock(inner);
      rows = parsed?.rows;
    } else if (inner && Array.isArray(inner.rows)) {
      rows = inner.rows;
    }
  }
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r: any) => r && r.country && (typeof r.value === "number" || typeof r.value === "string"))
    .map((r: any) => ({
      country: String(r.country),
      value: typeof r.value === "number" ? r.value : Number(String(r.value).replace(/[^\d.\-]/g, "")),
      previous: r.previous == null ? null : (typeof r.previous === "number" ? r.previous : Number(String(r.previous).replace(/[^\d.\-]/g, ""))),
    }))
    .filter((r) => Number.isFinite(r.value));
}

function buildLookup(rows: ScrapedRow[]): Map<string, ScrapedRow> {
  const m = new Map<string, ScrapedRow>();
  for (const r of rows) {
    const n = normalizeName(r.country);
    m.set(n, r);
    const alias = NAME_ALIASES[n];
    if (alias) m.set(normalizeName(alias), r);
  }
  return m;
}

function sentimentOf(curr: number | null, prev: number | null, higherIsBetter: boolean | null): "positive" | "negative" | "neutral" {
  if (curr == null || prev == null || higherIsBetter == null || curr === prev) return "neutral";
  const up = curr > prev;
  return (up && higherIsBetter) || (!up && !higherIsBetter) ? "positive" : "negative";
}
function trendOf(curr: number | null, prev: number | null): "up" | "down" | "flat" {
  if (curr == null || prev == null || curr === prev) return "flat";
  return curr > prev ? "up" : "down";
}

async function runJob(runId: string, _trigger: string) {
  const details: any[] = [];
  let total = 0;
  const breakdown = { macro_snapshot: 0, country_indicators: 0, interest_rates: 0 };

  try {
    // Load all DB context up-front
    const [{ data: snapshotRows }, { data: countries }, { data: defs }] = await Promise.all([
      supabase.from("macro_snapshot").select("*").order("display_order"),
      supabase.from("countries").select("code,name"),
      supabase.from("indicator_definitions").select("*"),
    ]);

    // Determine which slugs we need to scrape
    const neededSlugs = new Set<string>();
    for (const d of defs ?? []) {
      const s = INDICATOR_SLUGS[(d as any).key];
      if (s) neededSlugs.add(s);
    }
    for (const row of snapshotRows ?? []) {
      const s = MACRO_LABEL_SLUGS[normalizeName((row as any).label)];
      if (s) neededSlugs.add(s);
    }

    // Scrape all slugs in parallel — each TinyFish call takes ~60s and edge
    // functions cap at ~400s, so sequential would always time out.
    const scraped: Record<string, Map<string, ScrapedRow>> = {};
    const slugList = Array.from(neededSlugs);
    const results = await Promise.all(slugList.map(async (slug) => {
      try {
        const rows = await tinyfishScrape(slug);
        return { slug, ok: true as const, rows };
      } catch (e: any) {
        return { slug, ok: false as const, error: String(e?.message ?? e).slice(0, 300) };
      }
    }));
    for (const r of results) {
      if (r.ok) {
        scraped[r.slug] = buildLookup(r.rows);
        details.push({ scrape: r.slug, ok: true, rows: r.rows.length });
      } else {
        scraped[r.slug] = new Map();
        details.push({ scrape: r.slug, ok: false, error: r.error });
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    // ---------- macro_snapshot (India) ----------
    for (const row of snapshotRows ?? []) {
      const slug = MACRO_LABEL_SLUGS[normalizeName((row as any).label)];
      if (!slug) continue;
      const m = scraped[slug];
      const hit = m?.get(normalizeName("India"));
      if (!hit || hit.value == null) { details.push({ table: "macro_snapshot", label: row.label, skipped: "no India row" }); continue; }
      const curr = hit.value;
      const prev = hit.previous ?? null;
      const label: string = (row as any).label;
      const isUsdB = /forex|reserve|gdp\b/i.test(label) && !/growth/i.test(label);
      const isPct = !isUsdB;
      const value = isUsdB ? `$${curr.toFixed(0)}B` : isPct ? `${curr.toFixed(2)}%` : String(curr);
      const trend = trendOf(curr, prev);
      const higherIsBetter = /forex|gdp/i.test(label) ? true : /inflation/i.test(label) ? false : null;
      const sentiment = sentimentOf(curr, prev, higherIsBetter);
      const delta = prev == null
        ? "—"
        : isUsdB
          ? `${curr - prev >= 0 ? "+" : ""}$${(curr - prev).toFixed(1)}B`
          : `${curr - prev >= 0 ? "+" : ""}${(curr - prev).toFixed(2)} pp`;
      const { error } = await supabase.from("macro_snapshot")
        .update({ value, delta, trend, sentiment, status: "published", updated_at: new Date().toISOString() })
        .eq("id", (row as any).id);
      if (error) details.push({ table: "macro_snapshot", label, error: error.message });
      else { breakdown.macro_snapshot++; total++; }
    }

    // ---------- country_indicators ----------
    for (const def of defs ?? []) {
      const slug = INDICATOR_SLUGS[(def as any).key];
      if (!slug) continue;
      const m = scraped[slug];
      if (!m?.size) continue;
      for (const c of countries ?? []) {
        const hit = m.get(normalizeName((c as any).name)) ?? m.get(normalizeName(NAME_ALIASES[normalizeName((c as any).name)] ?? ""));
        if (!hit || hit.value == null) continue;
        const curr = hit.value;
        const prev = hit.previous ?? null;
        const trend = trendOf(curr, prev);
        const sentiment = sentimentOf(curr, prev, (def as any).higher_is_better);
        const { error } = await supabase.from("country_indicators").upsert({
          country_code: (c as any).code,
          indicator_key: (def as any).key,
          current_value: curr,
          previous_value: prev,
          change_value: prev != null ? curr - prev : null,
          trend,
          period_label: null,
          source: "Trading Economics",
          source_url: `https://tradingeconomics.com/country-list/${slug}`,
          sentiment,
          status: "published",
          last_updated: new Date().toISOString(),
        }, { onConflict: "country_code,indicator_key" });
        if (error) details.push({ table: "country_indicators", country: c.code, key: def.key, error: error.message });
        else { breakdown.country_indicators++; total++; }
      }
    }

    // ---------- interest_rates ----------
    const irMap = scraped["interest-rate"];
    const byMap = scraped["government-bond-10y"];
    if (irMap?.size || byMap?.size) {
      for (const c of countries ?? []) {
        const nm = normalizeName((c as any).name);
        const ir = irMap?.get(nm);
        const by = byMap?.get(nm);
        if (!ir && !by) continue;
        const row: any = { country_code: (c as any).code, status: "published" };
        if (ir?.value != null) {
          const irPrev = ir.previous ?? null;
          row.interest_rate = ir.value;
          row.interest_rate_change = irPrev != null ? ir.value - irPrev : null;
          row.interest_rate_updated = today;
          row.interest_rate_sentiment = irPrev == null ? "neutral" : ir.value < irPrev ? "positive" : ir.value > irPrev ? "negative" : "neutral";
          row.interest_rate_trend = trendOf(ir.value, irPrev);
        }
        if (by?.value != null) {
          const byPrev = by.previous ?? null;
          row.bond_yield = by.value;
          row.bond_yield_change = byPrev != null ? by.value - byPrev : null;
          row.bond_yield_updated = today;
          row.bond_yield_sentiment = byPrev == null ? "neutral" : by.value < byPrev ? "positive" : by.value > byPrev ? "negative" : "neutral";
          row.bond_yield_trend = trendOf(by.value, byPrev);
        }
        const { error } = await supabase.from("interest_rates").upsert(row, { onConflict: "country_code" });
        if (error) details.push({ table: "interest_rates", country: c.code, error: error.message });
        else { breakdown.interest_rates++; total++; }
      }
    }

    await supabase.from("macro_agent_runs").update({
      status: "succeeded", rows_updated: total, finished_at: new Date().toISOString(),
      details: { breakdown, items: details.slice(0, 500) },
    }).eq("id", runId);
  } catch (e: any) {
    await supabase.from("macro_agent_runs").update({
      status: "failed", error: String(e?.message ?? e), finished_at: new Date().toISOString(),
      details: { breakdown, items: details.slice(0, 500) },
    }).eq("id", runId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // AuthN + AuthZ: require a logged-in user with manager role.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const token = authHeader.slice(7);
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: canManage } = await userClient.rpc("can_manage", { _user_id: userData.user.id });
  if (!canManage) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const trigger = body?.trigger ?? "manual";

  const { data: run, error } = await supabase.from("macro_agent_runs")
    .insert({ trigger, status: "running" }).select().single();
  if (error || !run) {
    return new Response(JSON.stringify({ ok: false, error: error?.message ?? "insert failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // @ts-ignore EdgeRuntime is provided by the Supabase edge runtime
  EdgeRuntime.waitUntil(runJob(run.id, trigger));

  return new Response(JSON.stringify({ ok: true, runId: run.id, status: "running", note: "Scraping Trading Economics via TinyFish in the background. Watch Recent macro runs." }), {
    status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
