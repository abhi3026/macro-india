import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchIndicatorsBundle,
  formatValue,
  computeDiff,
  formatDiff,
  diffColorClass,
} from "@/lib/countryIndicators";

const EconomicIndicatorsDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["economic-indicators", "homepage"],
    queryFn: () => fetchIndicatorsBundle({ homepageOnly: true }),
    staleTime: 60_000,
  });

  const countries = data?.countries ?? [];
  const defs = data?.defs ?? [];
  const matrix = data?.matrix ?? {};

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-accent1" />
          Economic Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Country</TableHead>
                {defs.map((d) => (
                  <TableHead key={d.key} className="text-right font-medium whitespace-nowrap">
                    {d.label}
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
              {!isLoading &&
                countries.map((country) => (
                  <TableRow key={country.code}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {country.flag_emoji && <span className="text-base">{country.flag_emoji}</span>}
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
                              <div className="font-medium">{formatValue(cell.current_value, d.unit)}</div>
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
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/data-dashboard/economic-indicators">View More Data</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicIndicatorsDashboard;
