
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface MarketIndex {
  name: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
  flag?: string;
  high?: number;
  low?: number;
  open?: number;
  volume?: string;
}

// Initial market data
const INITIAL_MARKET_DATA: MarketIndex[] = [
  {
    name: "Dow Jones",
    last: 39142.23,
    change: -527.16,
    changePercent: -1.33,
    time: "17/04",
    flag: "🇺🇸",
    high: 39745.58,
    low: 38950.31,
  },
  {
    name: "Nasdaq",
    last: 16286.45,
    change: -20.71,
    changePercent: -0.13,
    time: "17/04",
    flag: "🇺🇸",
    high: 16408.51,
    low: 16181.17,
  },
  {
    name: "S&P 500",
    last: 5282.70,
    change: 7.00,
    changePercent: 0.13,
    time: "17/04",
    flag: "🇺🇸",
    high: 5328.31,
    low: 5255.58,
  },
  {
    name: "FTSE 100",
    last: 8092.12,
    change: 14.45,
    changePercent: 0.18,
    time: "17/04",
    flag: "🇬🇧",
    high: 8102.23,
    low: 8065.47,
  },
  {
    name: "DAX",
    last: 21205.86,
    change: -105.16,
    changePercent: -0.49,
    time: "17/04",
    flag: "🇩🇪",
    high: 21436.66,
    low: 21142.26,
  },
  {
    name: "Nikkei 225",
    last: 38437.95,
    change: -85.23,
    changePercent: -0.22,
    time: "17/04",
    flag: "🇯🇵",
    high: 38565.42,
    low: 38315.67,
  },
  {
    name: "Sensex",
    last: 73927.88,
    change: 335.39,
    changePercent: 0.46,
    time: "17/04",
    flag: "🇮🇳",
    high: 74052.21,
    low: 73678.92,
  },
  {
    name: "Nifty 50",
    last: 22452.18,
    change: 83.45,
    changePercent: 0.37,
    time: "17/04",
    flag: "🇮🇳",
    high: 22495.70,
    low: 22375.83,
  }
];

const Markets = () => {
  const [marketData, setMarketData] = useState<MarketIndex[]>(INITIAL_MARKET_DATA);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to simulate refreshing market data
  const refreshMarketData = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would fetch from an API
      // For now, let's simulate data changes
      const updatedData = marketData.map(index => {
        const changeDirection = Math.random() > 0.5 ? 1 : -1;
        const changeAmount = (Math.random() * 0.2) * changeDirection;
        const newLast = +(index.last * (1 + changeAmount / 100)).toFixed(2);
        const change = +(newLast - index.last).toFixed(2);
        const changePercent = +((change / index.last) * 100).toFixed(2);
        
        return {
          ...index,
          last: newLast,
          change,
          changePercent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      });
      
      setMarketData(updatedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing market data", error);
      toast({
        title: "Failed to update market data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [marketData]);

  // Auto-refresh market data every 60 seconds
  useEffect(() => {
    refreshMarketData();
    
    const intervalId = setInterval(() => {
      refreshMarketData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refreshMarketData]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Markets</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={refreshMarketData}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="text-right font-medium">Last</TableHead>
                <TableHead className="text-right font-medium">Chg.</TableHead>
                <TableHead className="text-right font-medium">Chg. %</TableHead>
                <TableHead className="text-right font-medium hidden md:table-cell">High</TableHead>
                <TableHead className="text-right font-medium hidden md:table-cell">Low</TableHead>
                <TableHead className="text-right font-medium">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((index) => (
                <TableRow key={index.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{index.flag}</span>
                      <span>{index.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{index.last.toLocaleString()}</TableCell>
                  <TableCell className={cn(
                    "text-right",
                    index.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {index.change >= 0 ? '+' : ''}{index.change.toLocaleString()}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right",
                    index.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {index.high?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {index.low?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">{index.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button asChild className="group">
            <Link to="/live-markets" className="flex items-center gap-2">
              Show All Indices
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Markets;
