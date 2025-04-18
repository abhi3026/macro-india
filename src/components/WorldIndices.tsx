import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="text-right font-medium">Last</TableHead>
                <TableHead className="text-right font-medium">High</TableHead>
                <TableHead className="text-right font-medium">Low</TableHead>
                <TableHead className="text-right font-medium">Chg.</TableHead>
                <TableHead className="text-right font-medium">Chg. %</TableHead>
                <TableHead className="text-right font-medium">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INDICES_DATA.map((index) => (
                <TableRow key={index.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{index.flag}</span>
                      <span>{index.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{index.last.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{index.high.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{index.low.toLocaleString()}</TableCell>
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
                  <TableCell className="text-right">{index.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldIndices;
