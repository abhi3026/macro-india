import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_interest_rates",
  title: "List interest rates & bonds",
  description:
    "Read the interest rates & bonds table: central-bank policy rates and 10-year bond yields per country with changes, trend and sentiment. Visibility follows the signed-in caller's permissions.",
  inputSchema: {
    country_code: z.string().trim().length(2).optional().describe("Two-letter country code filter, e.g. IN for India."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ country_code }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = await supabaseForUser(ctx);
    let query = supabase
      .from("interest_rates")
      .select("country_code, interest_rate, interest_rate_change, interest_rate_trend, interest_rate_sentiment, bond_yield, bond_yield_change, bond_yield_trend, bond_yield_sentiment, status")
      .order("country_code", { ascending: true });
    if (country_code) query = query.eq("country_code", country_code.toUpperCase());
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const rates = (data ?? []).map((r) => ({
      country_code: r.country_code,
      interest_rate: r.interest_rate,
      interest_rate_change: r.interest_rate_change,
      interest_rate_trend: r.interest_rate_trend,
      interest_rate_sentiment: r.interest_rate_sentiment,
      bond_yield: r.bond_yield,
      bond_yield_change: r.bond_yield_change,
      bond_yield_trend: r.bond_yield_trend,
      bond_yield_sentiment: r.bond_yield_sentiment,
      status: r.status,
    }));
    return {
      content: [{ type: "text", text: rates.length ? rates.map((r) => `${r.country_code}: policy ${r.interest_rate ?? "n/a"} (${r.interest_rate_trend ?? ""}), 10Y yield ${r.bond_yield ?? "n/a"} (${r.bond_yield_trend ?? ""})`).join("\n") : "No rate rows found." }],
      structuredContent: { rates },
    };
  },
});
