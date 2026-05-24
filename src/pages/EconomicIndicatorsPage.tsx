import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { cn } from "@/lib/utils";
import {
  fetchIndicatorsBundle,
  formatValue,
  computeDiff,
  formatDiff,
  sentimentColorClass,
} from "@/lib/countryIndicators";
import { CountryFlag } from "@/components/ui/country-flag";

const DEFAULT_VISIBLE = 12;

export default function EconomicIndicatorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["economic-indicators", "all"],
    queryFn: () => fetchIndicatorsBundle({ homepageOnly: false }),
    staleTime: 60_000,
  });

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const countries = data?.countries ?? [];
  const defs = (data?.defs ?? []).filter((d) => d.show_on_dashboard);
  const matrix = data?.matrix ?? {};

  const filtered = useMemo(
    () => countries.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const visible = showAll ? filtered : filtered.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Economic Indicators by Country | IndianMacro"
        description="Compare GDP growth, inflation, unemployment, PMI, and trade data across India, US, UK, EU, China, Japan and more. Updated economic indicators dashboard."
        canonicalUrl="/data-dashboard/economic-indicators"
        keywords="economic indicators India, GDP growth rate, inflation rate comparison, unemployment data, PMI index, global economic data"
      />
      <StructuredData
        type="Dataset"
        name="Global Economic Indicators Comparison"
        description="Key economic indicators including GDP, inflation, unemployment, PMI, exports, and confidence indices for major economies."
        url="/data-dashboard/economic-indicators"
        keywords={["GDP", "inflation", "unemployment", "PMI", "economic indicators", "India economy"]}
        spatialCoverage="Global"
        temporalCoverage="2024/2025"
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Data Dashboard", url: "/data-dashboard" },
          { name: "Economic Indicators", url: "/data-dashboard/economic-indicators" },
        ]}
      />

      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <PageHero
        title="Economic Indicators"
        description="Compare key economic indicators across major global economies"
      />

      <main className="flex-1 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Global Economic Indicators</h1>
            <p className="text-muted-foreground">
              Track and compare GDP growth, inflation, unemployment, PMI, and trade data across the world's economies.
            </p>
          </section>

          <Card className="p-6">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Input
                  placeholder="Search by country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {filtered.length} countries · {defs.length} indicators
                </p>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table className="table-fixed">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-muted/50 w-[1%] align-bottom break-words">Country</TableHead>
                      {defs.map((d) => (
                        <TableHead key={d.key} className="text-right w-[1%] align-bottom break-words">
                          {d.label}
                          {d.unit && d.unit !== "%" && (
                            <span className="text-muted-foreground font-normal"> ({d.unit})</span>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={defs.length + 1} className="text-center py-8 text-muted-foreground">
                          Loading…
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading && visible.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={defs.length + 1} className="text-center py-8 text-muted-foreground">
                          No countries match your search.
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading &&
                      visible.map((country) => (
                        <TableRow key={country.code} className="hover:bg-muted/50">
                          <TableCell className="sticky left-0 bg-background font-medium">
                            <span className="flex items-center gap-2">
                              <CountryFlag code={country.code} />
                              {country.name}
                            </span>
                          </TableCell>
                          {defs.map((d) => {
                            const cell = matrix[country.code]?.[d.key];
                            const diff = computeDiff(cell?.current_value ?? null, cell?.previous_value ?? null);
                            return (
                              <TableCell key={d.key} className="text-right">
                                {cell ? (
                                  <>
                                    <div className="font-medium">{formatValue(cell.current_value, d.unit === "%" ? "%" : null)}</div>
                                    <div className={cn("text-xs", diffColorClass(diff, d.higher_is_better))}>
                                      {formatDiff(diff)}
                                      {cell.period_label && (
                                        <span className="text-muted-foreground"> · {cell.period_label}</span>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {!showAll && filtered.length > DEFAULT_VISIBLE && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setShowAll(true)} className="gap-2">
                    View More Countries
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
