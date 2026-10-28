import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_macro_snapshot",
  title: "Get India at a glance",
  description:
    "Read the 'India at a glance' macro snapshot: headline indicators (GDP, inflation, repo rate, etc.) with latest value, change, trend and sentiment. Visibility follows the signed-in caller's permissions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("macro_snapshot")
      .select("label, value, delta, trend, sentiment, context, status")
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    const indicators = (data ?? []).map((r) => ({
      label: r.label,
      value: r.value,
      delta: r.delta,
      trend: r.trend,
      sentiment: r.sentiment,
      context: r.context,
      status: r.status,
    }));
    return {
      content: [{ type: "text", text: indicators.length ? indicators.map((i) => `${i.label}: ${i.value ?? ""} ${i.delta ?? ""} (${i.trend ?? ""}, ${i.sentiment ?? ""})`).join("\n") : "No snapshot data found." }],
      structuredContent: { indicators },
    };
  },
});
