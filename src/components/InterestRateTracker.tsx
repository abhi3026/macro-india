import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart } from "lucide-react";

interface RateData {
  country: string;
  flag: string;
  interestRate: {
    rate: number;
    change: number;
    lastUpdated: string;
  };
  bondYield: {
    rate: number;
    change: number;
    lastUpdated: string;
  };
}

const InterestRateTracker = () => {
  const [rates, setRates] = useState<RateData[]>([
    { 
      country: "India", 
      flag: "🇮🇳",
      interestRate: { rate: 6.50, change: 0, lastUpdated: "2024-02-08" },
      bondYield: { rate: 7.12, change: -0.05, lastUpdated: "2024-02-20" }
    },
    { 
      country: "USA", 
      flag: "🇺🇸",
      interestRate: { rate: 5.50, change: 0, lastUpdated: "2024-01-31" },
      bondYield: { rate: 4.28, change: 0.03, lastUpdated: "2024-02-20" }
    },
    { 
      country: "UK", 
      flag: "🇬🇧",
      interestRate: { rate: 5.25, change: 0, lastUpdated: "2024-02-01" },
      bondYield: { rate: 4.12, change: -0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "EU", 
      flag: "🇪🇺",
      interestRate: { rate: 4.50, change: 0, lastUpdated: "2024-01-25" },
      bondYield: { rate: 2.85, change: 0.01, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Japan", 
      flag: "🇯🇵",
      interestRate: { rate: -0.10, change: 0, lastUpdated: "2024-01-23" },
      bondYield: { rate: 0.72, change: 0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "China", 
      flag: "🇨🇳",
      interestRate: { rate: 3.45, change: -0.25, lastUpdated: "2024-02-20" },
      bondYield: { rate: 2.45, change: -0.03, lastUpdated: "2024-02-20" }
    }
  ]);

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md w-full">
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
              {rates.map((rate) => (
                <TableRow key={rate.country}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{rate.flag}</span>
                      <span>{rate.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{rate.interestRate.rate.toFixed(2)}%</div>
                    <div className={cn(
                      "text-sm",
                      rate.interestRate.change > 0 ? "text-green-600" : rate.interestRate.change < 0 ? "text-red-600" : "text-gray-600"
                    )}>
                      {rate.interestRate.change > 0 ? '+' : ''}{rate.interestRate.change.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{rate.bondYield.rate.toFixed(2)}%</div>
                    <div className={cn(
                      "text-sm",
                      rate.bondYield.change > 0 ? "text-green-600" : rate.bondYield.change < 0 ? "text-red-600" : "text-gray-600"
                    )}>
                      {rate.bondYield.change > 0 ? '+' : ''}{rate.bondYield.change.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(rate.interestRate.lastUpdated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/interest-rates">
              Show All
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestRateTracker;
