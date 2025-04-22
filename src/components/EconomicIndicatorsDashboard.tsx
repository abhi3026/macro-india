import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorValue {
  value: number;
  change?: number;
  unit: string;
  date: string;
}

type CountryData = {
  name: string;
  code: string;
  flag: string;
  gdp?: IndicatorValue;
  gdpGrowth?: IndicatorValue;
  inflation?: IndicatorValue;
  pmi?: IndicatorValue;
  unemployment?: IndicatorValue;
  exports?: IndicatorValue;
  businessConfidence?: IndicatorValue;
  consumerConfidence?: IndicatorValue;
  [key: string]: string | IndicatorValue | undefined;
};

const DEFAULT_ECONOMIC_DATA: CountryData[] = [
  {
    name: "India",
    code: "in",
    flag: "🇮🇳",
    gdp: { value: 3.74, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 8.4, change: 0.6, unit: "%", date: "Q4/23" },
    inflation: { value: 4.9, change: -0.3, unit: "%", date: "Mar/24" },
    unemployment: { value: 8.1, change: 0.3, unit: "%", date: "Mar/24" },
    pmi: { value: 59.1, change: 1.3, unit: "points", date: "Apr/24" },
    exports: { value: 41.4, unit: "USD bn", date: "Mar/24" },
    businessConfidence: { value: 55.2, change: 0.8, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 98.5, change: 1.2, unit: "points", date: "Apr/24" },
  },
  {
    name: "United States",
    code: "us",
    flag: "🇺🇸",
    gdp: { value: 27.36, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 2.5, change: 0.2, unit: "%", date: "Q4/23" },
    inflation: { value: 3.5, change: -0.2, unit: "%", date: "Mar/24" },
    unemployment: { value: 3.8, change: 0.1, unit: "%", date: "Mar/24" },
    pmi: { value: 51.2, change: 0.8, unit: "points", date: "Apr/24" },
    exports: { value: 266.4, unit: "USD bn", date: "Feb/24" },
    businessConfidence: { value: 52.8, change: -0.5, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 104.7, change: 2.1, unit: "points", date: "Apr/24" },
  },
  {
    name: "Eurozone",
    code: "eu",
    flag: "🇪🇺",
    gdp: { value: 14.52, unit: "EUR tn", date: "2023" },
    gdpGrowth: { value: 0.3, change: 0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 2.4, change: -0.1, unit: "%", date: "Mar/24" },
    unemployment: { value: 6.5, change: -0.1, unit: "%", date: "Feb/24" },
    pmi: { value: 51.5, change: 1.2, unit: "points", date: "Apr/24" },
    exports: { value: 211.3, unit: "EUR bn", date: "Feb/24" },
    businessConfidence: { value: 50.2, change: 0.3, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: -14.9, change: 0.5, unit: "points", date: "Apr/24" },
  },
  {
    name: "China",
    code: "cn",
    flag: "🇨🇳",
    gdp: { value: 17.8, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 5.3, change: 0.3, unit: "%", date: "Q1/24" },
    inflation: { value: 0.7, change: 0.4, unit: "%", date: "Mar/24" },
    unemployment: { value: 5.3, change: 0.1, unit: "%", date: "Mar/24" },
    pmi: { value: 50.4, change: -0.2, unit: "points", date: "Apr/24" },
    exports: { value: 280.1, unit: "USD bn", date: "Mar/24" },
    businessConfidence: { value: 51.8, change: -0.4, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 87.2, change: -1.5, unit: "points", date: "Apr/24" },
  },
  {
    name: "Japan",
    code: "jp",
    flag: "🇯🇵",
    gdp: { value: 4.23, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 1.2, change: -0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 2.8, change: -0.2, unit: "%", date: "Mar/24" },
    unemployment: { value: 2.6, change: 0, unit: "%", date: "Mar/24" },
    pmi: { value: 49.8, change: -0.5, unit: "points", date: "Apr/24" },
    exports: { value: 68.5, unit: "USD bn", date: "Mar/24" },
    businessConfidence: { value: 48.5, change: -1.2, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 36.2, change: 0.8, unit: "points", date: "Apr/24" },
  },
  {
    name: "UK",
    code: "uk",
    flag: "🇬🇧",
    gdp: { value: 3.33, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 0.2, change: 0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 3.2, change: -0.3, unit: "%", date: "Mar/24" },
    unemployment: { value: 3.9, change: 0, unit: "%", date: "Feb/24" },
    pmi: { value: 52.8, change: 1.5, unit: "points", date: "Apr/24" },
    exports: { value: 52.4, unit: "USD bn", date: "Feb/24" },
    businessConfidence: { value: 51.2, change: 0.8, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: -21.0, change: 1.5, unit: "points", date: "Apr/24" },
  },
  {
    name: "Australia",
    code: "au",
    flag: "🇦🇺",
    gdp: { value: 1.69, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 1.5, change: -0.2, unit: "%", date: "Q4/23" },
    inflation: { value: 3.6, change: -0.4, unit: "%", date: "Mar/24" },
    unemployment: { value: 3.8, change: -0.1, unit: "%", date: "Mar/24" },
    pmi: { value: 50.1, change: 0.3, unit: "points", date: "Apr/24" },
    exports: { value: 42.8, unit: "USD bn", date: "Mar/24" },
    businessConfidence: { value: 49.8, change: -0.5, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 82.4, change: -2.1, unit: "points", date: "Apr/24" },
  },
  {
    name: "Canada",
    code: "ca",
    flag: "🇨🇦",
    gdp: { value: 2.14, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 1.2, change: 0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 2.9, change: -0.2, unit: "%", date: "Mar/24" },
    unemployment: { value: 6.1, change: 0.2, unit: "%", date: "Mar/24" },
    pmi: { value: 50.6, change: 0.4, unit: "points", date: "Apr/24" },
    exports: { value: 52.1, unit: "USD bn", date: "Feb/24" },
    businessConfidence: { value: 51.5, change: 0.2, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 89.2, change: -1.8, unit: "points", date: "Apr/24" },
  },
  {
    name: "Brazil",
    code: "br",
    flag: "🇧🇷",
    gdp: { value: 2.17, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 2.9, change: 0.4, unit: "%", date: "Q4/23" },
    inflation: { value: 3.8, change: -0.3, unit: "%", date: "Mar/24" },
    unemployment: { value: 7.8, change: -0.2, unit: "%", date: "Mar/24" },
    pmi: { value: 48.5, change: -0.8, unit: "points", date: "Apr/24" },
    exports: { value: 24.8, unit: "USD bn", date: "Mar/24" },
    businessConfidence: { value: 47.2, change: -1.5, unit: "points", date: "Apr/24" },
    consumerConfidence: { value: 92.8, change: 2.1, unit: "points", date: "Apr/24" },
  }
];

const formatValue = (value: number, unit: string): string => {
  if (unit === "USD tn" || unit === "EUR tn") {
    return `${value.toFixed(2)} ${unit}`;
  }
  if (unit === "USD bn" || unit === "EUR bn") {
    return `${value.toFixed(1)} ${unit}`;
  }
  return `${value.toFixed(1)}${unit}`;
};

const EconomicIndicatorsDashboard = () => {
  const [data, setData] = useState<CountryData[]>(DEFAULT_ECONOMIC_DATA);

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
                <TableHead className="text-right font-medium">GDP</TableHead>
                <TableHead className="text-right font-medium">GDP Growth</TableHead>
                <TableHead className="text-right font-medium">PMI</TableHead>
                <TableHead className="text-right font-medium">Unemployment</TableHead>
                <TableHead className="text-right font-medium">Inflation</TableHead>
                <TableHead className="text-right font-medium">Exports</TableHead>
                <TableHead className="text-right font-medium">Business Confidence</TableHead>
                <TableHead className="text-right font-medium">Consumer Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((country) => (
                <TableRow key={country.code}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {country.gdp && formatValue(country.gdp.value, country.gdp.unit)}
                    <div className="text-xs text-muted-foreground">{country.gdp?.date}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {country.gdpGrowth && (
                      <>
                        <div className={cn(
                          "font-medium",
                          country.gdpGrowth.change && country.gdpGrowth.change > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatValue(country.gdpGrowth.value, country.gdpGrowth.unit)}
                        </div>
                        {country.gdpGrowth.change !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {country.gdpGrowth.change > 0 ? '+' : ''}{country.gdpGrowth.change.toFixed(1)}%
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.pmi && (
                      <>
                        <div className={cn(
                          "font-medium",
                          country.pmi.value > 50 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatValue(country.pmi.value, country.pmi.unit)}
                        </div>
                        {country.pmi.change !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {country.pmi.change > 0 ? '+' : ''}{country.pmi.change.toFixed(1)}
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.unemployment && (
                      <>
                        <div className="font-medium">
                          {formatValue(country.unemployment.value, country.unemployment.unit)}
                        </div>
                        {country.unemployment.change !== undefined && (
                          <div className={cn(
                            "text-xs",
                            country.unemployment.change < 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {country.unemployment.change > 0 ? '+' : ''}{country.unemployment.change.toFixed(1)}%
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.inflation && (
                      <>
                        <div className="font-medium">
                          {formatValue(country.inflation.value, country.inflation.unit)}
                        </div>
                        {country.inflation.change !== undefined && (
                          <div className={cn(
                            "text-xs",
                            country.inflation.change < 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {country.inflation.change > 0 ? '+' : ''}{country.inflation.change.toFixed(1)}%
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.exports && (
                      <>
                        <div className="font-medium">
                          {formatValue(country.exports.value, country.exports.unit)}
                        </div>
                        <div className="text-xs text-muted-foreground">{country.exports.date}</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.businessConfidence && (
                      <>
                        <div className={cn(
                          "font-medium",
                          country.businessConfidence.value > 50 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatValue(country.businessConfidence.value, country.businessConfidence.unit)}
                        </div>
                        {country.businessConfidence.change !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {country.businessConfidence.change > 0 ? '+' : ''}{country.businessConfidence.change.toFixed(1)}
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {country.consumerConfidence && (
                      <>
                        <div className={cn(
                          "font-medium",
                          country.consumerConfidence.value > 100 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatValue(country.consumerConfidence.value, country.consumerConfidence.unit)}
                        </div>
                        {country.consumerConfidence.change !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {country.consumerConfidence.change > 0 ? '+' : ''}{country.consumerConfidence.change.toFixed(1)}
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/data-dashboard/economic-indicators">
              View More Data
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicIndicatorsDashboard;
