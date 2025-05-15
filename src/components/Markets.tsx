
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateFallbackData, marketSymbols } from "@/lib/marketData";

// Updated type to change "currencies" to "forex"
type MarketCategory = "indices" | "stocks" | "crypto" | "commodities" | "forex";

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>("indices");

  // Updated to rename "Currencies" to "Forex"
  const categories: { id: MarketCategory; label: string }[] = [
    { id: "indices", label: "Indices" },
    { id: "stocks", label: "Stocks" },
    { id: "crypto", label: "Crypto" },
    { id: "commodities", label: "Commodities" },
    { id: "forex", label: "Forex" }  // Renamed from "Currencies"
  ];

  // Get all market data
  const allMarketData = generateFallbackData();
  
  // Map market categories to symbol types and include the requested symbols
  const categoryMap: { [key in MarketCategory]: { types: string[], symbols: string[] } } = {
    indices: { 
      types: ["index"],
      symbols: ["^NSEI", "^NSEBANK", "^BSESN", "^GSPC", "^FTSE", "^SSEC", "^N225", "^BVSP", "^GDAXI", "^FCHI"] 
    },
    stocks: { 
      types: ["stock"],
      symbols: ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "SBIN.NS", "HINDUNILVR.NS", "BHARTIARTL.NS", "WIPRO.NS", "LT.NS"] 
    },
    crypto: { 
      types: ["crypto"],
      symbols: ["BTCUSD", "ETHUSD", "SOLUSD", "XRPUSD", "DOGEUSD", "ADAUSD", "DOTUSD", "AVAXUSD", "SHIBUSD", "LINKUSD"] 
    },
    commodities: { 
      types: ["commodity"],
      symbols: ["GC=F", "SI=F", "CL=F", "BZ=F"] 
    },
    forex: { 
      types: ["forex"],
      symbols: ["USDINR=X", "GBPINR=X", "EURINR=X", "JPYINR=X", "AUDINR=X", "USDJPY=X", "USDEUR=X"] 
    },
  };
  
  // Filter data by the active category using marketSymbols for type information and preferred symbols
  const currentData = allMarketData.filter(item => {
    // Find the symbol details from marketSymbols array
    const symbolDetails = marketSymbols.find(s => s.symbol === item.symbol);
    
    // First check if this symbol is in our preferred list
    const isPreferredSymbol = categoryMap[activeCategory].symbols.includes(item.symbol);
    
    // If it's a preferred symbol or matches the type, include it
    return isPreferredSymbol || 
          (symbolDetails && categoryMap[activeCategory].types.includes(symbolDetails.type));
  });
  
  // Sort to prioritize our preferred symbols
  const sortedData = [...currentData].sort((a, b) => {
    const aIndex = categoryMap[activeCategory].symbols.indexOf(a.symbol);
    const bIndex = categoryMap[activeCategory].symbols.indexOf(b.symbol);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

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
              {sortedData.slice(0, 5).map((item, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="py-2 px-4">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.symbol}</div>
                  </td>
                  <td className="py-2 px-4 text-right">{item.price}</td>
                  <td className={`py-2 px-4 text-right ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                  </td>
                  <td className={`py-2 px-4 text-right ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
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
