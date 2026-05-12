import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useHomepageIndicators,
  diff,
  formatValue,
  type CountryIndicator,
  type IndicatorDef,
} from "@/hooks/useEconomicIndicators";

const Cell = ({ row, def }: { row?: CountryIndicator; def: IndicatorDef }) => {
  if (!row || row.current_value == null) {
    return <TableCell className="text-right text-muted-foreground">—</TableCell>;
  }
  const d = diff(row.current_value, row.previous_value);
  const better = def.higher_is_better;
  let valueColor = "";
  if (better === true) valueColor = row.current_value > 50 ? "text-green-600" : "text-red-600";
  if (def.key === "pmi" || def.key === "business_confidence")
    valueColor = row.current_value > 50 ? "text-green-600" : "text-red-600";
  if (def.key === "consumer_confidence")
    valueColor = row.current_value > 100 ? "text-green-600" : "text-red-600";
  if (def.key === "gdp_growth")
    valueColor = (d ?? 0) > 0 ? "text-green-600" : "text-red-600";

  let changeColor = "text-muted-foreground";
  if (d != null && better != null) {
    const good = better ? d > 0 : d < 0;
    changeColor = d === 0 ? "text-muted-foreground" : good ? "text-green-600" : "text-red-600";
  }

  return (
    <TableCell className="text-right">
      <div className={cn("font-medium", valueColor)}>
        {formatValue(row.current_value, def.unit)}
      </div>
      {d != null && (
        <div className={cn("text-xs", changeColor)}>
          {d > 0 ? "+" : ""}
          {d}
          {def.unit === "%" ? "%" : ""}
        </div>
      )}
      {row.period_label && def.key === "gdp" && (
        <div className="text-xs text-muted-foreground">{row.period_label}</div>
      )}
    </TableCell>
  );
};

const EconomicIndicatorsDashboard = () => {
  const { data, isLoading } = useHomepageIndicators();

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
                {data?.defs.map((def) => (
                  <TableHead key={def.key} className="text-right font-medium">
                    {def.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {data?.countries.map((country) => (
                <TableRow key={country.code}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{country.flag_emoji}</span>
                      <span>{country.name}</span>
                    </div>
                  </TableCell>
                  {data.defs.map((def) => (
                    <Cell
                      key={def.key}
                      def={def}
                      row={data.byCountry[country.code]?.[def.key]}
                    />
                  ))}
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
