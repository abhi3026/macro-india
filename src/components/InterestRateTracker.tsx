import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BarChart } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { fetchInterestRatesBundle } from "@/lib/interestRates";

const fmtChange = (n: number | null | undefined) => {
  if (n === null || n === undefined) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};
const sentimentColor = (s: string | null | undefined) =>
  s === "positive"
    ? "text-[hsl(var(--gain))]"
    : s === "negative"
    ? "text-[hsl(var(--loss))]"
    : "text-muted-foreground";

const InterestRateTracker = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["interest-rates", "homepage"],
    queryFn: () => fetchInterestRatesBundle({ homepageOnly: true }),
    staleTime: 60_000,
  });

  const countries = data?.countries ?? [];
  const byCode = data?.byCode ?? {};

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-accent1" />
          Interest Rates & Bonds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Country</TableHead>
                <TableHead className="text-right font-medium">Interest Rate (%)</TableHead>
                <TableHead className="text-right font-medium">10Y Bond Yield (%)</TableHead>
                <TableHead className="text-right font-medium">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
                </TableRow>
              )}
              {!isLoading && countries.map((country) => {
                const r = byCode[country.code];
                return (
                  <TableRow key={country.code}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CountryFlag code={country.code} />
                        <span>{country.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{r?.interest_rate != null ? `${r.interest_rate.toFixed(2)}%` : "—"}</div>
                      <div className={cn("text-sm", sentimentColor(r?.interest_rate_sentiment))}>{fmtChange(r?.interest_rate_change)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{r?.bond_yield != null ? `${r.bond_yield.toFixed(2)}%` : "—"}</div>
                      <div className={cn("text-sm", sentimentColor(r?.bond_yield_sentiment))}>{fmtChange(r?.bond_yield_change)}</div>
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
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/data-dashboard/interest-rates-bonds">Show All</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestRateTracker;
