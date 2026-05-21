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
import { CountryFlag } from "@/components/ui/country-flag";
import { fetchInterestRatesBundle } from "@/lib/interestRates";

const DEFAULT_VISIBLE = 12;

const fmtChange = (n: number | null | undefined) => {
  if (n === null || n === undefined) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};
const changeColor = (n: number | null | undefined) =>
  n === null || n === undefined || n === 0
    ? "text-muted-foreground"
    : n > 0
    ? "text-green-600"
    : "text-red-600";

const InterestRatesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["interest-rates", "all"],
    queryFn: () => fetchInterestRatesBundle({ homepageOnly: false }),
    staleTime: 60_000,
  });

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const countries = data?.countries ?? [];
  const byCode = data?.byCode ?? {};

  const filtered = useMemo(
    () => countries.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );
  const visible = showAll ? filtered : filtered.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Interest Rates & Bond Yields India | IndianMacro"
        description="Track RBI repo rate, reverse repo rate, 10-year G-Sec yields, and global central bank interest rates. Monitor India's bond market and monetary policy trends."
        canonicalUrl="/data-dashboard/interest-rates-bonds"
        keywords="RBI repo rate, India interest rates, 10 year government bond yield India, central bank rates, bond market India"
      />
      <StructuredData
        type="Dataset"
        name="Interest Rates & Bond Yields"
        description="Central bank interest rates, government bond yields, and monetary policy data for India and global economies."
        url="/data-dashboard/interest-rates-bonds"
        keywords={["interest rates", "bond yields", "RBI repo rate", "G-Sec yield", "monetary policy"]}
        spatialCoverage="Global"
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Data Dashboard", url: "/data-dashboard" },
          { name: "Interest Rates & Bonds", url: "/data-dashboard/interest-rates-bonds" },
        ]}
      />

      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>

      <PageHero
        title="Interest Rates & Bonds"
        description="Track interest rates, bond yields, and central bank policies"
      />

      <main className="flex-1 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Interest Rates & Bond Market Data</h1>
            <p className="text-muted-foreground">
              Monitor central bank policy rates and 10-year government bond yields across major global economies.
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
                <p className="text-xs text-muted-foreground">{filtered.length} countries</p>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-muted/50 min-w-[200px]">Country</TableHead>
                      <TableHead className="text-right min-w-[160px]">Interest Rate (%)</TableHead>
                      <TableHead className="text-right min-w-[160px]">10Y Bond Yield (%)</TableHead>
                      <TableHead className="text-right min-w-[140px]">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
                      </TableRow>
                    )}
                    {!isLoading && visible.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No countries match your search.
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading && visible.map((country) => {
                      const r = byCode[country.code];
                      return (
                        <TableRow key={country.code} className="hover:bg-muted/50">
                          <TableCell className="sticky left-0 bg-background font-medium">
                            <span className="flex items-center gap-2">
                              <CountryFlag code={country.code} />
                              {country.name}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-medium">{r?.interest_rate != null ? `${r.interest_rate.toFixed(2)}%` : "—"}</div>
                            <div className={cn("text-xs", changeColor(r?.interest_rate_change))}>{fmtChange(r?.interest_rate_change)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-medium">{r?.bond_yield != null ? `${r.bond_yield.toFixed(2)}%` : "—"}</div>
                            <div className={cn("text-xs", changeColor(r?.bond_yield_change))}>{fmtChange(r?.bond_yield_change)}</div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {r?.interest_rate_updated ? new Date(r.interest_rate_updated).toLocaleDateString() : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
};

export default InterestRatesPage;
