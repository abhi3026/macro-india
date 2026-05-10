import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb { name: string; href?: string }

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  align?: "left" | "center";
  aside?: React.ReactNode;
}

export function PageHero({ title, description, eyebrow, breadcrumbs, meta, align = "left", aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden hero-bg text-white">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 ${aside ? "grid lg:grid-cols-12 gap-8 lg:gap-10 items-center" : ""}`}>
        <div className={`${aside ? "lg:col-span-7" : ""} ${align === "center" ? "text-center" : ""}`}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-5 flex items-center gap-1 text-xs text-white/60" aria-label="Breadcrumb">
              {breadcrumbs.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  {c.href ? (
                    <Link to={c.href} className="hover:text-white transition-colors">{c.name}</Link>
                  ) : (
                    <span className="text-white/80">{c.name}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-white/30" />}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.12em] uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {eyebrow}
            </span>
          )}
          <h1 className={`mt-4 font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight ${align === "center" ? "mx-auto" : ""} max-w-3xl`}>
            {title}
          </h1>
          {description && (
            <p className={`mt-4 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
              {description}
            </p>
          )}
          {meta && <div className="mt-6">{meta}</div>}
        </div>
        {aside && (
          <div className="lg:col-span-5">
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

export default PageHero;
