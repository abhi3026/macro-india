import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_country_indicators",
  title: "List economic indicators",
  description:
    "Read the economic indicators table (GDP, inflation, unemployment, PMI, etc. per country) with latest value, change, trend and sentiment. Visibility follows the signed-in caller's permissions.",
  inputSchema: {
    country_code: z.string().trim().length(2).optional().describe("Two-letter country code filter, e.g. IN for India."),
    indicator_key: z.string().trim().min(1).max(80).optional().describe("Indicator key filter, e.g. gdp-growth."),
    limit: z.number().int().min(1).max(200).default(100).describe("How many rows to return (max 200)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ country_code, indicator_key, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    let query = supabase
      .from("country_indicators")
      .select("country_code, indicator_key, current_value, previous_value, change_value, period_label, trend, sentiment, last_updated, source, status")
      .order("country_code", { ascending: true })
      .limit(limit);
    if (country_code) query = query.eq("country_code", country_code.toUpperCase());
    if (indicator_key) query = query.eq("indicator_key", indicator_key);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const indicators = (data ?? []).map((r) => ({
      country_code: r.country_code,
      indicator_key: r.indicator_key,
      current_value: r.current_value,
      previous_value: r.previous_value,
      change_value: r.change_value,
      period_label: r.period_label,
      trend: r.trend,
      sentiment: r.sentiment,
      last_updated: r.last_updated,
      source: r.source,
      status: r.status,
    }));
    return {
      content: [{ type: "text", text: indicators.length ? indicators.map((i) => `${i.country_code} ${i.indicator_key}: ${i.current_value ?? "n/a"} (prev ${i.previous_value ?? "n/a"}, ${i.trend ?? ""}, ${i.sentiment ?? ""})`).join("\n") : "No indicator rows found." }],
      structuredContent: { indicators },
    };
  },
});
