import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_research_articles",
  title: "List research articles",
  description:
    "List macro research articles and market reports, newest first. Visibility follows the signed-in caller's permissions.",
  inputSchema: {
    category: z.string().trim().min(1).max(80).optional().describe("Filter by category, e.g. inflation or monetary-policy."),
    limit: z.number().int().min(1).max(50).default(20).describe("How many articles to return (max 50)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    let query = supabase
      .from("research_articles")
      .select("slug, title, category, excerpt, tags, published_at, status")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const articles = (data ?? []).map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      tags: a.tags,
      status: a.status,
      published_at: a.published_at,
      url: `/research/${a.slug}`,
    }));
    return {
      content: [{ type: "text", text: articles.length ? articles.map((a) => `${a.status === "published" ? "" : "[draft] "}${a.title} — ${a.url}`).join("\n") : "No research articles found." }],
      structuredContent: { articles },
    };
  },
});
