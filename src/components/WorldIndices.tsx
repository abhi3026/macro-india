
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Type for index data
interface IndexData {
  name: string;
  last: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  time: string;
  flag?: string;
}

const INDICES_DATA: IndexData[] = [
  {
    name: "Dow Jones",
    last: 39142.23,
    high: 39745.58,
    low: 38950.31,
    change: -527.16,
    changePercent: -1.33,
    time: "17/04",
    flag: "🇺🇸"
  },
  {
    name: "S&P 500",
    last: 5282.70,
    high: 5328.31,
    low: 5255.58,
    change: 7.00,
    changePercent: 0.13,
    time: "17/04",
    flag: "🇺🇸"
  },
  {
    name: "Nasdaq",
    last: 16286.45,
    high: 16408.51,
    low: 16181.17,
    change: -20.71,
    changePercent: -0.13,
    time: "17/04",
    flag: "🇺🇸"
  },
  {
    name: "S&P/TSX",
    last: 24192.81,
    high: 24307.00,
    low: 24058.27,
    change: 86.02,
    changePercent: 0.36,
    time: "17/04",
    flag: "🇨🇦"
  },
  {
    name: "Bovespa",
    last: 129650,
    high: 130091,
    low: 127973,
    change: 1333,
    changePercent: 1.04,
    time: "17/04",
    flag: "🇧🇷"
  },
  {
    name: "DAX",
    last: 21205.86,
    high: 21436.66,
    low: 21142.26,
    change: -105.16,
    changePercent: -0.49,
    time: "17/04",
    flag: "🇩🇪"
  }
];

const WorldIndices = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>World Indices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium px-4 py-2">Name</th>
                <th className="text-right font-medium px-4 py-2">Last</th>
                <th className="text-right font-medium px-4 py-2">High</th>
                <th className="text-right font-medium px-4 py-2">Low</th>
                <th className="text-right font-medium px-4 py-2">Chg.</th>
                <th className="text-right font-medium px-4 py-2">Chg. %</th>
                <th className="text-right font-medium px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {INDICES_DATA.map((index) => (
                <tr key={index.name} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{index.flag}</span>
                      <span>{index.name}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-2">{index.last.toLocaleString()}</td>
                  <td className="text-right px-4 py-2">{index.high.toLocaleString()}</td>
                  <td className="text-right px-4 py-2">{index.low.toLocaleString()}</td>
                  <td className={cn(
                    "text-right px-4 py-2",
                    index.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {index.change >= 0 ? '+' : ''}{index.change.toLocaleString()}
                  </td>
                  <td className={cn(
                    "text-right px-4 py-2",
                    index.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </td>
                  <td className="text-right px-4 py-2">{index.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button asChild variant="outline" className="group">
            <Link to="/live-markets" className="flex items-center gap-2">
              Full Market Data
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldIndices;
