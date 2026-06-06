// AI Content Agent — uses Google Gemini direct API (user-provided key) for
// educational posts (term explainers), research articles, and weekly reads.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"] as const;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const WEEKLY_SECTIONS = ["Policy", "Market", "Risk"] as const;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text.trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callGeminiOnce(model: string, system: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system + "\n\nRespond with ONLY valid JSON matching the requested schema. No prose, no markdown fences." }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    const err: any = new Error(`Gemini ${model} ${res.status}: ${t.slice(0, 400)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
  return text;
}

async function callGemini(system: string, prompt: string): Promise<string> {
  let lastErr: any;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        return await callGeminiOnce(model, system, prompt);
      } catch (e: any) {
        lastErr = e;
        const status = e?.status ?? 0;
        const retriable = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
        if (!retriable) break; // try next model
        await sleep(800 * Math.pow(2, attempt)); // 0.8s, 1.6s, 3.2s, 6.4s
      }
    }
  }
  throw lastErr ?? new Error("Gemini call failed");
}

async function generateJSON<T>(opts: { system: string; prompt: string }): Promise<T> {
  const text = await callGemini(opts.system, opts.prompt);
  return JSON.parse(extractJson(text)) as T;
}

// Curated foundational finance terms — educational posts focus on explaining
// individual finance/economics terms in depth.
const FOUNDATIONAL_TOPICS = [
  { title: "Repo Rate", category: "Monetary Policy", angle: "What the repo rate is, how the RBI sets it via the MPC, how it transmits to lending and deposit rates, EMIs, bond prices, and equity valuations." },
  { title: "Reverse Repo Rate", category: "Monetary Policy", angle: "Definition, role as the floor of the LAF corridor, how it absorbs liquidity, and the difference from the SDF." },
  { title: "CRR (Cash Reserve Ratio)", category: "Monetary Policy", angle: "What CRR is, how RBI uses it to control liquidity, impact on banks' lending capacity." },
  { title: "SLR (Statutory Liquidity Ratio)", category: "Monetary Policy", angle: "Definition, eligible assets, how SLR differs from CRR, and how changes affect bond demand." },
  { title: "CPI Inflation", category: "Macroeconomics", angle: "Definition, basket and weights, how CPI is computed in India, headline vs core, link to RBI policy." },
  { title: "WPI Inflation", category: "Macroeconomics", angle: "Wholesale Price Index basics, differences from CPI, sectoral weights, what trends signal for manufacturers." },
  { title: "PMI (Purchasing Managers' Index)", category: "Macroeconomics", angle: "What PMI measures, manufacturing vs services PMI, how to read the 50 threshold, India-specific publishers." },
  { title: "GDP (Gross Domestic Product)", category: "Macroeconomics", angle: "What it is, production/expenditure/income methods, nominal vs real, India's GDP composition." },
  { title: "Fiscal Deficit", category: "Fiscal Policy", angle: "What it measures, how it is funded, FRBM targets, why bond markets watch it." },
  { title: "Current Account Deficit", category: "Macroeconomics", angle: "BoP components, India's CAD drivers (oil, gold, services), why a wide CAD pressures the rupee." },
  { title: "Bonds", category: "Financial Markets", angle: "What a bond is, coupon vs yield, price-yield inverse relationship, types in India (G-Sec, T-Bills, SDL, corporate)." },
  { title: "Bond Yield", category: "Financial Markets", angle: "Yield to maturity, current yield, the 10-year G-Sec benchmark, what changing yields signal." },
  { title: "Yield Curve", category: "Financial Markets", angle: "What the yield curve is, normal/flat/inverted shapes, what each shape implies about growth and rates." },
  { title: "P/E Ratio", category: "Financial Markets", angle: "Trailing vs forward, how to calculate, sector averages, limits, and how to use it without overpaying." },
];

const LONGFORM_WRITER_SYSTEM = `You are an SEO copywriter for IndianMacro. Write long-form, beginner-to-intermediate financial education in clear, neutral British/Indian English. India-context aware.

Rules:
- Body: 1200–1800 words, markdown.
- Required H2 sections IN THIS ORDER (use these EXACT headings so the page can render an anchored TOC and FAQ schema):
  1. ## What it is
  2. ## How it is calculated
  3. ## Why it matters for investors
  4. ## India context
  5. ## Common misconceptions
  6. ## Key takeaways  (a bulleted list)
  7. ## FAQs  (3–5 H3 questions, each ending with "?", followed by a 2–4 sentence answer)
- Use H3 inside sections for sub-points where helpful.
- Include at least one formula or worked example in "How it is calculated".
- Do NOT start the body with an H1 (the title renders separately).
- SEO title: 50–60 chars. Meta description: 140–155 chars. Excerpt: 140–180 chars plain text.
- Slug: lowercase, hyphenated, ASCII only, max 80 chars.
- Be factual; avoid investment advice; use general examples.`;

const SHORTFORM_WRITER_SYSTEM = `You are an SEO copywriter for IndianMacro. Write clear, accurate, neutral, beginner-to-intermediate friendly financial education in British/Indian English. India-context aware.

Rules:
- Body: 800-1200 words, markdown.
- Structure: short intro paragraph, then H2/H3 sections, a "Key takeaways" bullet list near the end, and an FAQ section with 3 Q&As as H3 questions.
- Do NOT start the body with an H1 (title is rendered separately).
- SEO title: 50-60 chars. Meta description: 140-155 chars.
- Excerpt: 140-180 chars, plain text, no markdown.
- Slug: lowercase, hyphenated, ASCII only, max 80 chars.
- Be factual; avoid investment advice; use general examples.`;

async function runAgentJob(runId: string, _trigger: string, isSeed: boolean) {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const details: any[] = [];
  try {
    const [edu, res, wk] = await Promise.all([
      supabase.from("educational_posts").select("title,slug").limit(2000),
      supabase.from("research_articles").select("title,slug").limit(2000),
      supabase.from("weekly_reads").select("heading").limit(2000),
    ]);
    const normalize = (s: string) => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const existingTitles = [
      ...(edu.data ?? []).map((r: any) => r.title),
      ...(res.data ?? []).map((r: any) => r.title),
      ...(wk.data ?? []).map((r: any) => r.heading),
    ];
    const existingTitleSet = new Set(existingTitles.map(normalize));
    const existingSlugs = new Set([
      ...(edu.data ?? []).map((r: any) => r.slug),
      ...(res.data ?? []).map((r: any) => r.slug),
    ]);

    let topics: Array<{ table: string; category: string; title: string; angle: string; weekly_section?: string }>;

    if (isSeed) {
      topics = FOUNDATIONAL_TOPICS
        .filter((t) => !existingTitleSet.has(normalize(t.title)))
        .map((t) => ({ table: "educational_posts", category: t.category, title: t.title, angle: t.angle }));
    } else {
      const planSystem = `You are an editorial planner for IndianMacro, a financial education site focused on Indian and global markets. Plan SEO-optimised content.`;
      const planPrompt = `Pick exactly 5 fresh, high-search-intent topics distributed across these tables:
- educational_posts: SINGLE-TERM EXPLAINERS — each topic must be ONE specific finance/economics term to define and explain in depth (e.g. "Repo Rate", "PMI", "Yield Curve", "ELSS", "FDI", "NPS", "GST", "Beta", "Sharpe Ratio", "Debenture", "Treasury Bill", "MCLR", "CRR", "Operating Margin"). NOT how-to guides, NOT comparisons, NOT lists. Just one term to teach. (2 topics)
- research_articles: deeper analytical pieces, frameworks, sector or macro analysis (2 topics)
- weekly_reads: short topical insights (1 topic) — set weekly_section to one of: Policy, Market, Risk

Avoid overlap with these existing titles:
${existingTitles.slice(0, 100).map((t) => "- " + t).join("\n") || "(none)"}

Return JSON: { "topics": [ { "table": "...", "category": "...", "title": "...", "angle": "...", "weekly_section": "Policy|Market|Risk (only for weekly_reads)" } x5 ] }`;
      const plan = await generateJSON<{ topics: any[] }>({ system: planSystem, prompt: planPrompt });
      topics = plan.topics ?? [];
    }

    await supabase.from("ai_agent_runs").update({ topics_planned: topics.length }).eq("id", runId);

    if (topics.length === 0) {
      await supabase.from("ai_agent_runs").update({
        status: "succeeded", drafts_created: 0,
        details: [{ note: "All foundational topics already exist" }],
        finished_at: new Date().toISOString(),
      }).eq("id", runId);
      return;
    }

    const defaultWriterSystem = isSeed ? LONGFORM_WRITER_SYSTEM : SHORTFORM_WRITER_SYSTEM;
    const WEEKLY_WRITER_SYSTEM = `You are an editor for IndianMacro's "This Week's Reads". Write a single ultra-concise insight in neutral British/Indian English.

Rules:
- body_markdown: MAX 30 words, 1–2 sentences, plain prose, no markdown, no headings, no bullets.
- title: short, punchy (max 12 words), no trailing punctuation.
- excerpt: same as body, max 30 words.
- seo_title: 50–60 chars. seo_description: 140–155 chars.
- Be factual; avoid investment advice.`;

    for (const topic of topics) {
      try {
        if (existingTitleSet.has(normalize(topic.title))) {
          details.push({ topic: topic.title, skipped: "duplicate title" });
          continue;
        }
        const isWeekly = topic.table === "weekly_reads";
        const isEducational = topic.table === "educational_posts";
        const writerSystem = isWeekly ? WEEKLY_WRITER_SYSTEM : defaultWriterSystem;
        const extraNote = isEducational && !isSeed
          ? "\n\nThis is a SINGLE-TERM EXPLAINER. The whole article must define and explain this one term thoroughly."
          : "";
        const article = await generateJSON<any>({
          system: writerSystem,
          prompt: `Write ${isWeekly ? "a 30-word weekly insight" : "a full article"}.
Topic: ${topic.title}
Angle: ${topic.angle}
Category: ${topic.category}
Target table: ${topic.table}${extraNote}

Return JSON: { "title", "slug", "category", "excerpt", "body_markdown", "seo_title", "seo_description" }`,
        });

        if (isWeekly) {
          const words = (article.body_markdown ?? "").trim().split(/\s+/);
          if (words.length > 30) article.body_markdown = words.slice(0, 30).join(" ").replace(/[,;:]?$/, "") + ".";
        }

        if (!article.title || existingTitleSet.has(normalize(article.title))) {
          details.push({ topic: topic.title, skipped: "duplicate generated title" });
          continue;
        }
        existingTitleSet.add(normalize(article.title));

        let slug = slugify(article.slug || article.title);
        if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
        existingSlugs.add(slug);

        let inserted = false;
        let insertErr: string | null = null;

        if (topic.table === "educational_posts") {
          const { error } = await supabase.from("educational_posts").insert({
            title: article.title, slug, category: article.category,
            excerpt: article.excerpt, body: article.body_markdown,
            status: "draft",
            seo_title: article.seo_title, seo_description: article.seo_description,
          });
          insertErr = error?.message ?? null;
          inserted = !error;
        } else if (topic.table === "research_articles") {
          const { error } = await supabase.from("research_articles").insert({
            title: article.title, slug, category: article.category,
            excerpt: article.excerpt, body: article.body_markdown,
            status: "draft",
            seo_title: article.seo_title, seo_description: article.seo_description,
            tags: [], references_list: [],
          });
          insertErr = error?.message ?? null;
          inserted = !error;
        } else {
          const section = topic.weekly_section ?? "Market";
          const { error } = await supabase.from("weekly_reads").insert({
            section, heading: article.title, body: article.body_markdown,
            status: "draft",
          });
          insertErr = error?.message ?? null;
          inserted = !error;
        }

        details.push({ table: topic.table, title: article.title, slug, ok: inserted, error: insertErr });
      } catch (e: any) {
        details.push({ table: topic.table, title: topic.title, ok: false, error: e?.message ?? String(e) });
      }
    }

    const draftsCreated = details.filter((d) => d.ok).length;
    await supabase.from("ai_agent_runs").update({
      status: draftsCreated > 0 ? "succeeded" : "failed",
      drafts_created: draftsCreated,
      details, finished_at: new Date().toISOString(),
    }).eq("id", runId);
  } catch (e: any) {
    await supabase.from("ai_agent_runs").update({
      status: "failed", error: e?.message ?? String(e),
      details, finished_at: new Date().toISOString(),
    }).eq("id", runId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const trigger = (body as any)?.trigger ?? "manual";
  const isSeed = trigger === "seed_basics";
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: runRow, error: runErr } = await supabase
    .from("ai_agent_runs")
    .insert({ trigger, status: "running", model: `google/${MODEL}` })
    .select()
    .single();
  if (runErr || !runRow) {
    return new Response(JSON.stringify({ error: runErr?.message ?? "insert failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // @ts-ignore EdgeRuntime is provided by the Supabase edge runtime
  EdgeRuntime.waitUntil(runAgentJob(runRow.id, trigger, isSeed));

  return new Response(JSON.stringify({
    runId: runRow.id, status: "running",
    note: "Generation started in background. Watch Recent runs for progress.",
  }), { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
