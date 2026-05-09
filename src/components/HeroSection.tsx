import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const chips = [
  { label: "GDP (FY25)", value: "7.2%", delta: "+0.3", trend: "up" as const },
  { label: "CPI Inflation", value: "4.5%", delta: "-0.2", trend: "down" as const },
  { label: "Repo Rate", value: "6.50%", delta: "0.00", trend: "up" as const },
  
];

const sources = ["RBI", "MOSPI", "SEBI", "NSE", "World Bank", "IMF"];

const HeroSection = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden hero-bg text-white">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* faint upward curve */}
      <svg className="absolute right-0 bottom-0 w-[60%] h-[80%] opacity-[0.08] pointer-events-none" viewBox="0 0 800 400" fill="none" preserveAspectRatio="none">
        <path d="M0,380 C150,360 250,300 380,260 C520,215 620,160 800,40" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M0,380 C150,360 250,300 380,260 C520,215 620,160 800,40 L800,400 L0,400 Z" fill="url(#g)" />
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              India · Macro Intelligence · {today}
            </span>

            <h1
              id="hero-heading"
              className="mt-5 font-display text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-[1.02] tracking-tight"
            >
              Institutional-grade insights on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                India's economy
              </span>
              .
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
              Track GDP, inflation, RBI policy, interest rates and capital markets in one
              place. Built for investors, analysts and finance professionals who need
              signal — not noise.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-white text-[hsl(240_100%_13%)] hover:bg-white/90 font-medium">
                <Link to="/data-dashboard">
                  Explore the dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/research">Read research</Link>
              </Button>
            </div>

            {/* Sources */}
            <div className="mt-6">
              <p className="text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2">Trusted data sources</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {sources.map((s) => (
                  <span key={s} className="text-sm font-medium text-white/55 tracking-wide">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Live chips */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] tracking-wider uppercase text-white/55">{c.label}</p>
                    {c.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                    )}
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{c.value}</p>
                  <p className={`mt-1 text-xs tabular-nums ${c.trend === "up" ? "text-emerald-300" : "text-rose-300"}`}>
                    {c.delta}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-white/35 text-right">Indicative · refreshed daily</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
