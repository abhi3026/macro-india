import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

const insights = [
  {
    tag: "Policy",
    icon: TrendingUp,
    title: "RBI's prolonged pause signals confidence in disinflation path",
    body: "With CPI tracking inside the 4±2% band for a third straight print, the bar for the first cut has moved to Q1 FY26. Liquidity ops, not the repo rate, remain the active lever.",
    accent: "text-[hsl(var(--brand))]",
  },
  {
    tag: "Markets",
    icon: Lightbulb,
    title: "Term premium is rebuilding at the long end of the G-Sec curve",
    body: "Foreign inflows post-JPM index inclusion have compressed the 5Y, but the 10–30Y segment is steepening as supply concerns return. Watch the auction calendar.",
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    tag: "Risk",
    icon: AlertCircle,
    title: "Crude above $90 would re-open the inflation–CAD trade-off",
    body: "Every $10 sustained move in Brent costs ~30 bps on the CAD and ~25 bps on headline CPI. The current hedge: record forex reserves and a tighter fiscal glide path.",
    accent: "text-[hsl(var(--loss))]",
  },
];

const InsightLayer = () => {
  return (
    <section aria-labelledby="insights-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">
            This Week's Read
          </p>
          <h2 id="insights-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            What the data is telling us
          </h2>
        </div>
        <Link
          to="/research"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand))] hover:underline"
        >
          All research <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((i) => {
          const Icon = i.icon;
          return (
            <article
              key={i.title}
              className="group relative rounded-xl border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent ${i.accent}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground font-medium">
                  {i.tag}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold leading-snug tracking-tight mb-3">
                {i.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{i.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default InsightLayer;
