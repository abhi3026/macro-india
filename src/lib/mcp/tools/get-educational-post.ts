import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_educational_post",
  title: "Get educational post",
  description: "Fetch one educational finance post by its slug, including the full article body.",
  inputSchema: {
    slug: z.string().trim().min(1).max(200).describe("The post's URL slug, from list_educational_posts."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("educational_posts")
      .select("slug, title, category, excerpt, body, author_name, published_at, status, canonical_url")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error(`No educational post found with slug "${slug}".`);
    const post = {
      slug: data.slug,
      title: data.title,
      category: data.category,
      excerpt: data.excerpt,
      body: data.body,
      author_name: data.author_name,
      status: data.status,
      published_at: data.published_at,
      url: `/education/${data.category ?? ""}/${data.slug}`,
    };
    return {
      content: [{ type: "text", text: `# ${post.title}\n\n${post.body ?? ""}` }],
      structuredContent: { post },
    };
  },
});
