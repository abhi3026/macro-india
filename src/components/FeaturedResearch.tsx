import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchResearchPosts } from "@/utils/contentLoader";

const FALLBACK = [
  { tag: "Monetary Policy", title: "RBI Policy Analysis", desc: "Decoding the latest MPC decision: rate stance, liquidity tools and the path of inflation.", to: "/research", read: "8 min read" },
  { tag: "Fiscal", title: "Budget Impact Assessment", desc: "Sector-by-sector breakdown of the Union Budget and second-order effects on equity markets.", to: "/research", read: "12 min read" },
  { tag: "Sectoral", title: "Agriculture Sector Outlook", desc: "Monsoon, MSP and rural demand: what the data signals for FMCG, fertilisers and tractors.", to: "/research", read: "10 min read" },
];

const FeaturedResearch = ({ vertical = false }: { vertical?: boolean }) => {
  const { data } = useQuery({ queryKey: ["public-research"], queryFn: fetchResearchPosts });

  // Prefer items explicitly toggled "show on homepage"; fall back to most recent published.
  const ranked = (data ?? []).slice().sort((a, b) => Number(!!b.showOnHomepage) - Number(!!a.showOnHomepage));
  const items = ranked.length > 0
    ? ranked.slice(0, 3).map((p) => ({
        tag: p.category,
        title: p.title,
        desc: p.description,
        to: `/research/${p.slug}`,
        read: `${Math.max(3, Math.ceil((p.content || "").length / 1200))} min read`,
      }))
    : FALLBACK;

  return (
    <section
      aria-labelledby="featured-research"
      className={vertical ? "w-full h-full flex flex-col rounded-lg border bg-card shadow-sm p-5 sm:p-6" : "space-y-5"}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="featured-research" className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
            Featured Research
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Long-form macro analysis from our desk.</p>
        </div>
        <Link to="/research" className="hidden sm:inline-flex items-center text-sm font-medium text-brand hover:underline">
          All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className={vertical ? "mt-5 flex-1 flex flex-col divide-y divide-border" : "grid grid-cols-1 md:grid-cols-3 gap-5"}>
        {items.map((it) => (
          <Link
            key={it.to + it.title}
            to={it.to}
            onClick={() => window.scrollTo(0, 0)}
            className={vertical
              ? "group flex flex-col py-4 first:pt-0 last:pb-0 transition-colors"
              : "group surface p-5 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-elegant"}
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand font-semibold">{it.tag}</div>
            <h3 className="mt-1.5 font-display text-[15px] sm:text-base font-semibold leading-snug group-hover:text-brand transition-colors">{it.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">{it.desc}</p>
            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
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
