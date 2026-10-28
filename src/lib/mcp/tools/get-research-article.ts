import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_research_article",
  title: "Get research article",
  description: "Fetch one research article by its slug, including the full report body.",
  inputSchema: {
    slug: z.string().trim().min(1).max(200).describe("The article's URL slug, from list_research_articles."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("research_articles")
      .select("slug, title, category, excerpt, body, author_name, tags, published_at, status, canonical_url")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error(`No research article found with slug "${slug}".`);
    const article = {
      slug: data.slug,
      title: data.title,
      category: data.category,
      excerpt: data.excerpt,
      body: data.body,
      author_name: data.author_name,
      tags: data.tags,
      status: data.status,
      published_at: data.published_at,
      url: `/research/${data.slug}`,
    };
    return {
      content: [{ type: "text", text: `# ${article.title}\n\n${article.body ?? ""}` }],
      structuredContent: { article },
    };
  },
});
