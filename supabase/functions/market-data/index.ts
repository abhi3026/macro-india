// Proxies Alpha Vantage Global Quote requests so the API key stays server-side.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_SYMBOLS = new Set(["NIFTY", "SENSEX", "BANKNIFTY"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const symbol = (url.searchParams.get("symbol") || "").toUpperCase();

    if (!ALLOWED_SYMBOLS.has(symbol)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing symbol" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Market data provider not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const upstream = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`,
    );

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await upstream.json();
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    console.error("market-data error", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
