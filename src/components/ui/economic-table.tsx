
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export type EconomicData = {
  flag: string;
  country: string;
  gdp: number;
  gdpGrowth: number;
  pmi: number;
  unemployment: number;
  inflation: number;
  exports: number;
  businessConfidence: number;
  consumerConfidence: number;
};

interface EconomicTableProps {
  data: EconomicData[];
  onViewMore?: () => void;
}

export function EconomicTable({ data, onViewMore }: EconomicTableProps) {
  return (
    <div className="w-full">
      <div className="rounded-md border bg-background">
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Country</TableHead>
                  <TableHead className="text-right">GDP (B USD)</TableHead>
                  <TableHead className="text-right">GDP Growth %</TableHead>
                  <TableHead className="text-right">PMI</TableHead>
                  <TableHead className="text-right">Unemployment %</TableHead>
                  <TableHead className="text-right">Inflation %</TableHead>
                  <TableHead className="text-right">Exports (B USD)</TableHead>
                  <TableHead className="text-right">Business Confidence</TableHead>
                  <TableHead className="text-right">Consumer Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.country}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.flag} 
                          alt={`${item.country} flag`} 
                          className="h-5 w-8 rounded object-cover" 
                        />
                        <span>{item.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.gdp.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={item.gdpGrowth >= 0 ? "text-accent2 flex items-center justify-end" : "text-accent3 flex items-center justify-end"}>
                        {item.gdpGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {item.gdpGrowth.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={item.pmi >= 50 ? "text-accent2" : "text-accent3"}>
                        {item.pmi.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.unemployment.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={item.inflation <= 2.5 ? "text-accent2" : item.inflation >= 6 ? "text-accent3" : "text-foreground"}>
                        {item.inflation.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.exports.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={item.businessConfidence >= 50 ? "text-accent2" : "text-accent3"}>
                        {item.businessConfidence.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.consumerConfidence.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      
      {onViewMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onViewMore}>
            View All Economic Indicators
          </Button>
        </div>
      )}
    </div>
  );
}
