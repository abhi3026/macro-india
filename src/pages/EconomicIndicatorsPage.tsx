import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
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
import {
  useDashboardIndicators,
  diff,
  formatValue,
} from "@/hooks/useEconomicIndicators";
import { cn } from "@/lib/utils";

export default function EconomicIndicatorsPage() {
  const { data, isLoading } = useDashboardIndicators();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const DEFAULT_VISIBLE = 25;

  const filtered = (data?.countries ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, DEFAULT_VISIBLE);
  const colCount = (data?.defs?.length ?? 0) + 1;

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
              Track and compare GDP growth, inflation, unemployment, PMI, and trade data across the world's largest economies.
            </p>
          </section>

          <Card className="p-6">
            <div className="w-full space-y-4">
              <div className="flex items-center">
                <Input
                  placeholder="Search by country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-muted/50 min-w-[200px]">Country</TableHead>
                      {data?.defs.map((def) => (
                        <TableHead key={def.key} className="text-right min-w-[140px]">
                          {def.label}
                          {def.unit ? ` (${def.unit})` : ""}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={((data?.defs?.length ?? 0) as number) + 1} className="text-center py-8 text-muted-foreground">
                          Loading…
                        </TableCell>
                      </TableRow>
                    )}
                    {visible.map((country) => (
                      <TableRow key={country.code} className="hover:bg-muted/50">
                        <TableCell className="sticky left-0 bg-background font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{country.flag_emoji}</span>
                            {country.name}
                          </div>
                        </TableCell>
                        {data?.defs.map((def) => {
                          const row = data!.byCountry[country.code]?.[def.key];
                          const d = diff(row?.current_value, row?.previous_value);
                          const better = def.higher_is_better;
                          let chg = "text-muted-foreground";
                          if (d != null && better != null && d !== 0) {
                            chg = (better ? d > 0 : d < 0) ? "text-green-600" : "text-red-600";
                          }
                          return (
                            <TableCell key={def.key} className="text-right">
                              <div className="font-medium tabular-nums">
                                {formatValue(row?.current_value, def.unit)}
                              </div>
                              {d != null && (
                                <div className={cn("text-xs tabular-nums", chg)}>
                                  {d > 0 ? "+" : ""}{d}
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                    {!isLoading && visible.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={(data?.defs.length ?? 0) + 1} className="text-center py-8 text-muted-foreground">
                          No countries match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {!showAll && filtered.length > DEFAULT_VISIBLE && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setShowAll(true)} className="gap-2">
                    View More Countries <ChevronDown className="h-4 w-4" />
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
