
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateFallbackData, marketSymbols, fetchMarketData } from "@/lib/marketData";
import { Skeleton } from "@/components/ui/skeleton";

// Updated type to change "currencies" to "forex"
type MarketCategory = "indices" | "stocks" | "crypto" | "commodities" | "forex";

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>("indices");
  const [marketData, setMarketData] = useState(() => generateFallbackData());
  const [loading, setLoading] = useState(true);

  // Updated to rename "Currencies" to "Forex"
  const categories: { id: MarketCategory; label: string }[] = [
    { id: "indices", label: "Indices" },
    { id: "stocks", label: "Stocks" },
    { id: "crypto", label: "Crypto" },
    { id: "commodities", label: "Commodities" },
    { id: "forex", label: "Forex" }  // Renamed from "Currencies"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchMarketData();
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Use fallback data in case of error
        setMarketData(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh every 5 minutes
    const refreshTimer = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshTimer);
  }, []);
  
  // Define preferred symbols for each category
  const preferredSymbols: Record<MarketCategory, string[]> = {
    indices: ["^NSEI", "^NSEBANK", "^BSESN", "^GSPC", "^FTSE", "^SSEC", "^N225", "^BVSP", "^GDAXI", "^FCHI"],
    stocks: ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "SBIN.NS", "HINDUNILVR.NS", "BHARTIARTL.NS", "WIPRO.NS", "LT.NS"],
    crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD", "ADA-USD", "DOT-USD", "AVAX-USD", "SHIB-USD", "LINK-USD"],
    commodities: ["GC=F", "SI=F", "CL=F", "BZ=F"], // Gold, Silver, WTI Crude, Brent Crude
    forex: ["USDINR=X", "GBPINR=X", "EURINR=X", "JPYINR=X", "AUDINR=X", "USDJPY=X", "USDEUR=X"]
  };
  
  // Map market categories to symbol types for filtering non-preferred symbols
  const categoryTypeMap: Record<MarketCategory, string[]> = {
    indices: ["index"],
    stocks: ["stock"],
    crypto: ["crypto"],
    commodities: ["commodity"],
    forex: ["forex"]
  };

  // Filter by active category and preferred symbols
  const filteredData = marketData.filter(item => {
    // Check if this is a preferred symbol for the active category
    const isPrefSymbol = preferredSymbols[activeCategory].includes(item.symbol);
    if (isPrefSymbol) return true;
    
    // If not a preferred symbol, check if it matches the category type
    const symbolDetails = marketSymbols.find(s => s.symbol === item.symbol);
    return symbolDetails && categoryTypeMap[activeCategory].includes(symbolDetails.type);
  });
  
  // Sort to prioritize preferred symbols
  const sortedData = [...filteredData].sort((a, b) => {
    const aIndex = preferredSymbols[activeCategory].indexOf(a.symbol);
    const bIndex = preferredSymbols[activeCategory].indexOf(b.symbol);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Limit to first 5 items for display
  const displayData = sortedData.slice(0, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-accent1" />
            Markets
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? "bg-accent1 hover:bg-accent1/90" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-right py-3 px-4 font-semibold">Last</th>
                <th className="text-right py-3 px-4 font-semibold">Change</th>
                <th className="text-right py-3 px-4 font-semibold">% Change</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 px-4">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </td>
                    <td className="py-2 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="py-2 px-4 text-right"><Skeleton className="h-4 w-14 ml-auto" /></td>
                    <td className="py-2 px-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="py-2 px-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.symbol}</div>
                    </td>
                    <td className="py-2 px-4 text-right">{item.price.toFixed(2)}</td>
                    <td className={`py-2 px-4 text-right ${item.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                    </td>
                    <td className={`py-2 px-4 text-right ${item.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted-foreground">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link to={`/data-dashboard/markets?tab=${activeCategory}`}>
              Show All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Markets;
