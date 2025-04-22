import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketData {
  flag?: string;
  symbol: string;
  name: string;
  lastPrice: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
}

interface MarketTableProps {
  data: MarketData[];
  showVolume?: boolean;
  itemsPerPage?: number;
}

export function MarketTable({ data, showVolume = false, itemsPerPage = 20 }: MarketTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex items-center">
        <Input
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="sticky left-0 bg-muted/50">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Last Price</TableHead>
              <TableHead className="text-right">Change %</TableHead>
              {showVolume && <TableHead className="text-right">Volume</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-muted/50">
                <TableCell className="sticky left-0 bg-background font-medium">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 