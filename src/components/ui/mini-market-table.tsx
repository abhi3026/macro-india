import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MarketData } from "./market-table";

interface MiniMarketTableProps {
  title: string;
  data: MarketData[];
  showVolume?: boolean;
  maxRows?: number;
  tabValue: string;
}

export function MiniMarketTable({ 
  title, 
  data, 
  showVolume = false, 
  maxRows = 5,
  tabValue 
}: MiniMarketTableProps) {
  const visibleData = data.slice(0, maxRows);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Link to={`/data-dashboard/markets?tab=${tabValue}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            Show All {title}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Last Price</TableHead>
              <TableHead className="text-right">Change %</TableHead>
              {showVolume && <TableHead className="text-right">Volume</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.flag && (
                      <img
                        src={item.flag}
                        alt={`${item.name} flag`}
                        className="h-4 w-6 object-cover rounded"
                      />
                    )}
                    {item.symbol}
                  </div>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.lastPrice.toLocaleString()}
                </TableCell>
                <TableCell className={cn(
                  "text-right",
                  item.changePercent >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </TableCell>
                {showVolume && (
                  <TableCell className="text-right">
                    {item.volume?.toLocaleString()}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 