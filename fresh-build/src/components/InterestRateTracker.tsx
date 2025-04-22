
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart } from "lucide-react";

interface RateData {
  country: string;
  flag: string;
  centralBank: string;
  currentRate: number;
  previousRate: number;
  nextMeeting: string;
  yieldCurve: {
    '2yr': number;
    '5yr': number;
    '10yr': number;
    '30yr'?: number;
  };
}

const INITIAL_RATES_DATA: RateData[] = [
  {
    country: "United States",
    flag: "🇺🇸",
    centralBank: "Federal Reserve",
    currentRate: 5.50,
    previousRate: 5.50,
    nextMeeting: "June 12, 2025",
    yieldCurve: {
      '2yr': 4.81,
      '5yr': 4.42,
      '10yr': 4.49,
      '30yr': 4.67
    }
  },
  {
    country: "Eurozone",
    flag: "🇪🇺",
    centralBank: "European Central Bank",
    currentRate: 4.50,
    previousRate: 4.50,
    nextMeeting: "May 8, 2025",
    yieldCurve: {
      '2yr': 3.32,
      '5yr': 3.18,
      '10yr': 3.39,
      '30yr': 3.58
    }
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    centralBank: "Bank of England",
    currentRate: 5.25,
    previousRate: 5.25,
    nextMeeting: "May 9, 2025",
    yieldCurve: {
      '2yr': 4.38,
      '5yr': 4.20,
      '10yr': 4.35,
      '30yr': 4.58
    }
  },
  {
    country: "India",
    flag: "🇮🇳",
    centralBank: "Reserve Bank of India",
    currentRate: 6.50,
    previousRate: 6.50,
    nextMeeting: "June 5, 2025",
    yieldCurve: {
      '2yr': 7.02,
      '5yr': 7.15,
      '10yr': 7.10,
      '30yr': 7.30
    }
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    centralBank: "Bank of Japan",
    currentRate: 0.10,
    previousRate: 0.00,
    nextMeeting: "June 19, 2025",
    yieldCurve: {
      '2yr': 0.31,
      '5yr': 0.59,
      '10yr': 0.94,
      '30yr': 1.67
    }
  },
];

const InterestRateTracker = () => {
  const [ratesData, setRatesData] = useState(INITIAL_RATES_DATA);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate live data updates
  useEffect(() => {
    const updateRatesData = () => {
      // Apply small random changes to rates (simulating market movements)
      setRatesData(prevData => {
        return prevData.map(country => {
          const updatedYields = { ...country.yieldCurve };
          
          // Update each yield with a small random change (max ±0.05%)
          Object.keys(updatedYields).forEach(tenor => {
            const currentYield = updatedYields[tenor as keyof typeof updatedYields];
            const change = (Math.random() - 0.5) * 0.05;
            updatedYields[tenor as keyof typeof updatedYields] = +(currentYield + change).toFixed(2);
          });
          
          return { ...country, yieldCurve: updatedYields };
        });
      });
      
      setLastUpdated(new Date());
    };
    
    // Update every 45 seconds
    const interval = setInterval(updateRatesData, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-accent1" />
          Interest Rates & Bonds
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Policy Rate</TableHead>
                <TableHead className="text-right hidden md:table-cell">Next Meeting</TableHead>
                <TableHead className="text-right">10Y Yield</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratesData.map((data) => (
                <TableRow key={data.country} className="transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{data.flag}</span>
                      <div className="flex flex-col">
                        <span>{data.country}</span>
                        <span className="text-xs text-muted-foreground">{data.centralBank}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-medium">{data.currentRate.toFixed(2)}%</span>
                      {data.currentRate > data.previousRate ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : data.currentRate < data.previousRate ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                    {data.nextMeeting}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {data.yieldCurve['10yr'].toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestRateTracker;
