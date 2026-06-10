import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase backdrop-blur text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            India · Macro Intelligence · {today}
          </span>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Institutional-grade insights on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
              India's economy
            </span>
            .
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed">
            Track GDP, inflation, RBI policy, interest rates and capital markets in one
            place. Built for investors, analysts and finance professionals who need
            signal — not noise.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-white text-[hsl(240_100%_13%)] hover:bg-white/90 font-medium">
              <Link to="/data-dashboard">
                Explore the dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/research">Read research</Link>
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/95 mb-2">Trusted data sources</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {sources.map((s) => (
                <span key={s} className="text-sm font-medium text-white/95 tracking-wide">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
