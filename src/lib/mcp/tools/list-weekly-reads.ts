import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_weekly_reads",
  title: "List weekly reads",
  description: "List curated weekly market reads, newest first. Visibility follows the signed-in caller's permissions.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("How many entries to return (max 50)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("weekly_reads")
      .select("heading, section, body, link_url, published_at, status")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    const reads = (data ?? []).map((r) => ({
      heading: r.heading,
      section: r.section,
      body: r.body,
      link_url: r.link_url,
      status: r.status,
      published_at: r.published_at,
    }));
    return {
      content: [{ type: "text", text: reads.length ? reads.map((r) => `${r.status === "published" ? "" : "[draft] "}${r.heading}${r.link_url ? ` (${r.link_url})` : ""}`).join("\n") : "No weekly reads found." }],
      structuredContent: { reads },
    };
  },
});
