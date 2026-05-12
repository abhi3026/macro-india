import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useHomepageIndicators, diff, formatValue } from "@/hooks/useEconomicIndicators";

const KEYS = ["gdp_growth", "inflation", "repo_rate", "g_sec_10y", "usd_inr", "forex_reserves"];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--gain))]" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-[hsl(var(--loss))]" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const MacroSummary = () => {
  // We use the dashboard query (not homepage) so India-only indicators (repo rate, forex etc.) are available.
  const { data } = useHomepageIndicators();
  // Note: hook above filters to homepage indicators. We instead pull all defs by reading a lightweight query.
  // To keep things simple we fetch dashboard data via a separate hook call:
  // (kept inline to avoid hook complexity)
  // — but we need defs for all keys. Use a separate fetch.

  const updated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Build metrics from any India indicators available in current cache
  const indiaRows = data?.byCountry["in"] ?? {};
  const defsByKey = Object.fromEntries((data?.defs ?? []).map((d) => [d.key, d]));

  const metrics = KEYS.map((key) => {
    const def = defsByKey[key];
    const row = indiaRows[key];
    if (!def || !row) return null;
    const d = diff(row.current_value, row.previous_value);
    const trend: "up" | "down" | "flat" = d == null || d === 0 ? "flat" : d > 0 ? "up" : "down";
    return {
      label: def.label,
      value: formatValue(row.current_value, def.unit),
      delta: d == null ? "—" : `${d > 0 ? "+" : ""}${d}${def.unit === "%" ? " pp" : ""}`,
      trend,
      context: row.notes ?? row.period_label ?? "",
    };
  }).filter(Boolean) as { label: string; value: string; delta: string; trend: "up" | "down" | "flat"; context: string }[];

  if (metrics.length === 0) return null;

  return (
    <section aria-labelledby="macro-summary" className="border-y bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1 font-medium">
              Macro Snapshot
            </p>
            <h2 id="macro-summary" className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
              India at a glance
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-wider uppercase text-muted-foreground">Updated</p>
            <p className="text-xs font-medium tabular-nums">{updated}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border rounded-lg overflow-hidden bg-card divide-x divide-y sm:divide-y-0 [&>*:nth-child(-n+3)]:sm:border-b lg:[&>*]:!border-b-0">
          {metrics.map((m) => (
            <Link
              key={m.label}
              to="/data-dashboard"
              className="group p-4 hover:bg-accent/40 transition-colors"
            >
              <p className="text-[10px] tracking-wider uppercase text-muted-foreground truncate">
                {m.label}
              </p>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-xl font-semibold tabular-nums">{m.value}</span>
                <TrendIcon trend={m.trend} />
              </div>
              <p
                className={`mt-0.5 text-[11px] font-medium tabular-nums ${
                  m.trend === "up"
                    ? "text-[hsl(var(--gain))]"
                    : m.trend === "down"
                    ? "text-[hsl(var(--loss))]"
                    : "text-muted-foreground"
                }`}
              >
                {m.delta}
              </p>
              {m.context && <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{m.context}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MacroSummary;
