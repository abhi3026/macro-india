
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateFallbackData, MarketData as MarketDataType } from "@/lib/marketData";

type MarketCategory = "indices" | "stocks" | "crypto" | "commodities" | "currencies";

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>("indices");

  const categories: { id: MarketCategory; label: string }[] = [
    { id: "indices", label: "Indices" },
    { id: "stocks", label: "Stocks" },
    { id: "crypto", label: "Crypto" },
    { id: "commodities", label: "Commodities" },
    { id: "currencies", label: "Currencies" }
  ];

  // Get data for the active category by filtering the generated fallback data
  const allMarketData = generateFallbackData();
  
  // Map market types to our categories
  const categoryMap: { [key in MarketCategory]: string[] } = {
    indices: ["index"],
    stocks: ["stock"],  // Note: This might need to be adjusted based on actual data
    crypto: ["crypto"],
    commodities: ["commodity"],
    currencies: ["forex"],
  };
  
  // Filter data by the active category
  const currentData = allMarketData.filter(item => {
    const symbolDetails = allMarketData.find(s => s.symbol === item.symbol);
    // Default to indices if no match (this helps with fallback)
    return symbolDetails ? categoryMap[activeCategory].includes(symbolDetails.type || "index") : activeCategory === "indices";
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
              {currentData.slice(0, 5).map((item, index) => (
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
            <Link to={`/live-markets?category=${activeCategory}`}>
              Show All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Markets;
