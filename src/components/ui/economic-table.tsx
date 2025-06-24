import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface EconomicData {
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
}

interface EconomicTableProps {
  data: EconomicData[];
  defaultVisibleCount?: number;
  onViewMore?: () => void;
}

export function EconomicTable({ 
  data, 
  defaultVisibleCount = 9,
  onViewMore 
}: EconomicTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show either all data or just the default count
  const visibleData = showAll ? filteredData : filteredData.slice(0, defaultVisibleCount);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex items-center">
        <Input
          placeholder="Search by country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="sticky left-0 bg-muted/50 min-w-[200px]">Country</TableHead>
              <TableHead className="text-right min-w-[120px]">GDP ($ Billion)</TableHead>
              <TableHead className="text-right min-w-[120px]">GDP Growth (%)</TableHead>
              <TableHead className="text-right min-w-[100px]">PMI</TableHead>
              <TableHead className="text-right min-w-[140px]">Unemployment (%)</TableHead>
              <TableHead className="text-right min-w-[120px]">Inflation (%)</TableHead>
              <TableHead className="text-right min-w-[140px]">Exports ($ Billion)</TableHead>
              <TableHead className="text-right min-w-[160px]">Business Confidence</TableHead>
              <TableHead className="text-right min-w-[160px]">Consumer Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((item) => (
              <TableRow key={item.country} className="hover:bg-muted/50">
                <TableCell className="sticky left-0 bg-background font-medium">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.flag}
                      alt={`${item.country} flag`}
                      className="h-4 w-6 object-cover rounded"
                    />
                    {item.country}
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.gdp.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.gdpGrowth.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.pmi.toFixed(1)}</TableCell>
                <TableCell className="text-right">{item.unemployment.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.inflation.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.exports.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.businessConfidence.toFixed(1)}</TableCell>
                <TableCell className="text-right">{item.consumerConfidence.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View More Button */}
      {!showAll && filteredData.length > defaultVisibleCount && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowAll(true);
              onViewMore?.();
            }}
            className="gap-2"
          >
            View More Countries
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 