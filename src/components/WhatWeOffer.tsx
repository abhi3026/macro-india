import { Link } from "react-router-dom";
import { LineChart, FileText, GraduationCap, Bell, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const offerings = [
  {
    icon: LineChart,
    title: "Live macro dashboard",
    body: "GDP, inflation, IIP, PMI, trade, fiscal and monetary indicators — visualised, sourced and refreshed continuously.",
    href: "/data-dashboard",
    cta: "Open dashboard",
  },
  {
    icon: FileText,
    title: "Independent research",
    body: "Sector and policy notes written by economists. No sales pitch, no model portfolios — just analysis.",
    href: "/research",
    cta: "Browse research",
  },
  {
    icon: GraduationCap,
    title: "Macro literacy",
    body: "Primers, glossaries and explainers that translate central bank speak into investor decisions.",
    href: "/education",
    cta: "Start learning",
  },
  {
    icon: Bell,
    title: "Weekly briefing",
    body: "One email, every Monday. The five things that moved India's economy and what they imply for markets.",
    href: "#newsletter",
    cta: "Subscribe",
  },
];

const WhatWeOffer = () => {
  return (
    <section aria-labelledby="offer-heading">
      <SectionHeader
        id="offer-heading"
        eyebrow="What we do"
        title="A single source for India's macro intelligence"
        description="Built for portfolio managers, research analysts and policy watchers who need primary data, expert context and a clear point of view."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offerings.map((o) => {
          const Icon = o.icon;
          return (
            <Link
              key={o.title}
              to={o.href}
              className="group relative flex flex-col rounded-xl border bg-card p-6 hover:border-foreground/20 hover:shadow-[var(--shadow-elegant)] transition-all"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground mb-4">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight mb-2">
                {o.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{o.body}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand))] group-hover:gap-2 transition-all">
                {o.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default WhatWeOffer;
