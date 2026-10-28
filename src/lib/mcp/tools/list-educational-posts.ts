import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_educational_posts",
  title: "List educational posts",
  description:
    "List educational finance posts (explained terms like repo rate, PMI, bonds), newest first. Visibility follows the signed-in caller's permissions.",
  inputSchema: {
    category: z.string().trim().min(1).max(80).optional().describe("Filter by category slug, e.g. monetary-policy."),
    limit: z.number().int().min(1).max(50).default(20).describe("How many posts to return (max 50)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    let query = supabase
      .from("educational_posts")
      .select("slug, title, category, excerpt, published_at, status")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const posts = (data ?? []).map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      status: p.status,
      published_at: p.published_at,
      url: `/education/${p.category ?? ""}/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: posts.length ? posts.map((p) => `${p.status === "published" ? "" : "[draft] "}${p.title} — ${p.url}`).join("\n") : "No educational posts found." }],
      structuredContent: { posts },
    };
  },
});
