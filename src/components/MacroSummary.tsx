import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Link } from "react-router-dom";

type Trend = "up" | "down" | "flat";

interface Metric {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  context: string;
}

const metrics: Metric[] = [
  { label: "Real GDP Growth", value: "7.2%", delta: "+0.3 pp YoY", trend: "up", context: "Above 10-yr avg" },
  { label: "CPI Inflation", value: "4.5%", delta: "-0.2 pp MoM", trend: "down", context: "Within RBI band" },
  { label: "Repo Rate", value: "6.50%", delta: "Unchanged", trend: "flat", context: "On hold since Feb '23" },
  { label: "10Y G-Sec", value: "7.14%", delta: "-4 bps WoW", trend: "down", context: "Curve steepening" },
  { label: "USD/INR", value: "83.02", delta: "-0.24%", trend: "down", context: "RBI defending 83.5" },
  { label: "Forex Reserves", value: "$642B", delta: "+$2.1B", trend: "up", context: "Near record high" },
];

const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--gain))]" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-[hsl(var(--loss))]" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const MacroSummary = () => {
  const updated = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border rounded-lg overflow-hidden bg-card divide-x-0 sm:divide-x divide-y sm:divide-y-0 [&>*:nth-child(-n+2)]:divide-y-0 sm:[&>*:nth-child(-n+3)]:border-b lg:[&>*]:border-b-0">
          {metrics.map((m) => (
            <Link
              key={m.label}
              to="/data-dashboard"
              className="group p-4 hover:bg-accent/40 transition-colors border-b sm:border-b-0 last:border-b-0"
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
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{m.context}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MacroSummary;
