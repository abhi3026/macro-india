import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const items = [
  {
    tag: "Monetary Policy",
    title: "RBI Policy Analysis",
    desc: "Decoding the latest MPC decision: rate stance, liquidity tools and the path of inflation.",
    to: "/research/rbi-policy",
    read: "8 min read",
  },
  {
    tag: "Fiscal",
    title: "Budget Impact Assessment",
    desc: "Sector-by-sector breakdown of the Union Budget and second-order effects on equity markets.",
    to: "/research/budget-impact",
    read: "12 min read",
  },
  {
    tag: "Sectoral",
    title: "Agriculture Sector Outlook",
    desc: "Monsoon, MSP and rural demand: what the data signals for FMCG, fertilisers and tractors.",
    to: "/research/agriculture-outlook",
    read: "10 min read",
  },
];

const FeaturedResearch = () => {
  return (
    <section aria-labelledby="featured-research" className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="featured-research" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Featured Research
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Long-form macro analysis from our desk.</p>
        </div>
        <Link to="/research" className="hidden sm:inline-flex items-center text-sm font-medium text-brand hover:underline">
          All research <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            onClick={() => window.scrollTo(0, 0)}
            className="group surface p-6 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-brand font-semibold">
              {it.tag}
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-brand transition-colors">
              {it.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{it.desc}</p>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{it.read}</span>
              <span className="inline-flex items-center gap-1 text-foreground font-medium">
                Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedResearch;
