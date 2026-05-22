import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, TrendingUp, AlertCircle, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Insight = {
  id?: string;
  tag: string;
  title: string;
  body: string;
  link_url?: string | null;
};

const FALLBACK: Insight[] = [
  {
    tag: "Policy",
    title: "RBI's prolonged pause signals confidence in disinflation path",
    body: "With CPI tracking inside the 4±2% band for a third straight print, the bar for the first cut has moved to Q1 FY26. Liquidity ops, not the repo rate, remain the active lever.",
  },
  {
    tag: "Market",
    title: "Term premium is rebuilding at the long end of the G-Sec curve",
    body: "Foreign inflows post-JPM index inclusion have compressed the 5Y, but the 10–30Y segment is steepening as supply concerns return. Watch the auction calendar.",
  },
  {
    tag: "Risk",
    title: "Crude above $90 would re-open the inflation–CAD trade-off",
    body: "Every $10 sustained move in Brent costs ~30 bps on the CAD and ~25 bps on headline CPI. The current hedge: record forex reserves and a tighter fiscal glide path.",
  },
];

const META: Record<string, { icon: LucideIcon; accent: string }> = {
  Policy: { icon: TrendingUp, accent: "text-[hsl(var(--brand))]" },
  Market: { icon: Lightbulb, accent: "text-amber-600 dark:text-amber-400" },
  Markets: { icon: Lightbulb, accent: "text-amber-600 dark:text-amber-400" },
  Risk: { icon: AlertCircle, accent: "text-[hsl(var(--loss))]" },
};

const InsightLayer = () => {
  const { data } = useQuery({
    queryKey: ["weekly-reads-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_reads")
        .select("id, section, heading, body, link_url")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id, tag: r.section, title: r.heading, body: r.body ?? "", link_url: r.link_url,
      })) as Insight[];
    },
  });

  const insights = data && data.length ? data : FALLBACK;

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
          const meta = META[i.tag] ?? META.Policy;
          const Icon = meta.icon;
          const Wrapper: any = i.link_url ? "a" : "article";
          const wrapProps = i.link_url
            ? { href: i.link_url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={i.id ?? i.title}
              {...wrapProps}
              className="group relative rounded-xl border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow block"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent ${meta.accent}`}>
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
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
};

export default InsightLayer;
