import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, LineChart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden hero-bg text-white"
    >
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            India Macroeconomic Intelligence
          </span>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight"
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

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-lg text-left">
            {[
              { icon: BarChart3, k: "120+", v: "Indicators" },
              { icon: LineChart, k: "Daily", v: "Updates" },
              { icon: ShieldCheck, k: "Sourced", v: "RBI · MOSPI · SEBI" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={v} className="border-l border-white/15 pl-4">
                <Icon className="h-4 w-4 text-white/60 mb-2" />
                <dt className="font-display text-2xl font-semibold tabular-nums">{k}</dt>
                <dd className="text-xs text-white/60 mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
