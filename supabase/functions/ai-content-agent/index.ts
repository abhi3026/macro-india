import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { generateText } from "npm:ai";
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";
import { z } from "npm:zod";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MODEL = "google/gemini-3-flash-preview";

const gateway = createOpenAICompatible({
  name: "lovable",
  baseURL: "https://ai.gateway.lovable.dev/v1",
  headers: {
    "Lovable-API-Key": LOVABLE_API_KEY,
    "X-Lovable-AIG-SDK": "vercel-ai-sdk",
  },
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const WEEKLY_SECTIONS = ["Policy", "Market", "Risk"] as const;

const TopicSchema = z.object({
  topics: z.array(z.object({
    table: z.enum(["educational_posts", "research_articles", "weekly_reads"]),
    category: z.string(),
    title: z.string(),
    angle: z.string(),
    weekly_section: z.enum(WEEKLY_SECTIONS).optional(),
  })).length(5),
});

const ArticleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  excerpt: z.string(),
  body_markdown: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
});

// Strip markdown fences from model output that wraps JSON
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text.trim();
}

async function generateJSON<T>(opts: { system: string; prompt: string; schema: z.ZodType<T> }): Promise<T> {
  const { text } = await generateText({
    model: gateway(MODEL),
    system: opts.system + "\n\nRespond with ONLY valid JSON matching the requested schema. No prose, no markdown fences.",
    prompt: opts.prompt,
  });
  const json = JSON.parse(extractJson(text));
  return opts.schema.parse(json);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const trigger = (body as any)?.trigger ?? "manual";

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // 1. Start run record
  const { data: runRow, error: runErr } = await supabase
    .from("ai_agent_runs")
    .insert({ trigger, status: "running", model: MODEL })
    .select()
    .single();
  if (runErr) {
    return new Response(JSON.stringify({ error: runErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const runId = runRow.id;
  const details: any[] = [];

  try {
    // 2. Fetch recent titles for dedupe (last 60 days)
    const sinceISO = new Date(Date.now() - 60 * 86400 * 1000).toISOString();
    const [edu, res, wk] = await Promise.all([
      supabase.from("educational_posts").select("title,slug").gte("created_at", sinceISO).limit(200),
      supabase.from("research_articles").select("title,slug").gte("created_at", sinceISO).limit(200),
      supabase.from("weekly_reads").select("heading").gte("created_at", sinceISO).limit(200),
    ]);
    const existingTitles = [
      ...(edu.data ?? []).map((r: any) => r.title),
      ...(res.data ?? []).map((r: any) => r.title),
      ...(wk.data ?? []).map((r: any) => r.heading),
    ];
    const existingSlugs = new Set([
      ...(edu.data ?? []).map((r: any) => r.slug),
      ...(res.data ?? []).map((r: any) => r.slug),
    ]);

    // 3. Topic planner
    const planSystem = `You are an editorial planner for IndianMacro, a financial education site focused on Indian and global markets, investments, mutual funds, macroeconomics, banking, taxation, and regulation. Plan SEO-optimised educational content.`;
    const planPrompt = `Pick exactly 5 fresh, high-search-intent topics distributed across these tables:
- educational_posts: how-to / explainer / beginner content (2 topics)
- research_articles: deeper analytical pieces, frameworks, sector or macro analysis (2 topics)
- weekly_reads: short topical insights (1 topic) — set weekly_section to one of: Policy, Market, Risk

Avoid overlap with these recently published titles:
${existingTitles.slice(0, 100).map((t) => "- " + t).join("\n") || "(none)"}

Cover a mix of domains: equity markets, mutual funds, fixed income, macroeconomics, RBI/SEBI policy, personal finance, taxation, global linkages. Prefer India context.

Return JSON: { "topics": [ { "table": "...", "category": "...", "title": "...", "angle": "...", "weekly_section": "Policy|Market|Risk (only for weekly_reads)" } x5 ] }`;

    const plan = await generateJSON({ system: planSystem, prompt: planPrompt, schema: TopicSchema });
    await supabase.from("ai_agent_runs").update({ topics_planned: plan.topics.length }).eq("id", runId);

    // 4. Writer — generate each article and insert as draft
    const writerSystem = `You are an SEO copywriter for IndianMacro. Write clear, accurate, neutral, beginner-to-intermediate friendly financial education in British/Indian English. India-context aware.

Rules:
- Body: 800-1200 words, markdown.
- Structure: short intro paragraph, then H2/H3 sections, a "Key takeaways" bullet list near the end, and an FAQ section with 3 Q&As as H3 questions.
- Do NOT start the body with an H1 (title is rendered separately).
- SEO title: 50-60 chars. Meta description: 140-155 chars.
- Excerpt: 140-180 chars, plain text, no markdown.
- Slug: lowercase, hyphenated, ASCII only, max 80 chars.
- Be factual; avoid investment advice; use general examples.`;

    for (const topic of plan.topics) {
      try {
        const article = await generateJSON({
          system: writerSystem,
          prompt: `Write a full article.
Topic: ${topic.title}
Angle: ${topic.angle}
Category: ${topic.category}
Target table: ${topic.table}

Return JSON: { "title", "slug", "category", "excerpt", "body_markdown", "seo_title", "seo_description" }`,
          schema: ArticleSchema,
        });

        // Ensure unique slug
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

    return new Response(JSON.stringify({ runId, draftsCreated, details }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    await supabase.from("ai_agent_runs").update({
      status: "failed", error: e?.message ?? String(e),
      details, finished_at: new Date().toISOString(),
    }).eq("id", runId);
    return new Response(JSON.stringify({ error: e?.message ?? String(e), runId }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
