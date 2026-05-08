const stats = [
  { value: "120+", label: "Indicators tracked" },
  { value: "15+", label: "Official data sources" },
  { value: "Daily", label: "Macro updates" },
  { value: "10 yrs", label: "Historical depth" },
];

const TrustStrip = () => {
  return (
    <section aria-label="Coverage at a glance" className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:border-r last:border-r-0 border-border/60 px-2">
              <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] tracking-wider uppercase text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
