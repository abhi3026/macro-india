import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMarketData } from "@/lib/marketData";

type MarketData = {
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

const MarketTickerLive = () => {
  const [markets, setMarkets] = useState<MarketData[]>([
    { name: "NIFTY 50", price: 25380.42, change: 127.35, changePercent: 0.59 },
    { name: "SENSEX", price: 83412.47, change: 423.95, changePercent: 0.60 },
    { name: "USD/INR", price: 83.25, change: -0.12, changePercent: -0.14 },
    { name: "Gold", price: 2480.50, change: 12.50, changePercent: 0.52 },
    { name: "Crude Oil", price: 78.45, change: -0.65, changePercent: -0.82 },
    { name: "10Y Yield", price: 7.142, change: 0.028, changePercent: 0.39 },
  ]);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const data = await fetchMarketData();
        
        if (data && data.length > 0) {
          // Map specific symbols we want in the ticker
          const nifty = data.find(item => item.symbol === "^NSEI");
          const sensex = data.find(item => item.symbol === "^BSESN");
          const usdInr = data.find(item => item.symbol === "USDINR=X");
          const gold = data.find(item => item.symbol === "GC=F");
          const crude = data.find(item => item.symbol === "CL=F");
          
          const newMarketData: MarketData[] = [];
          
          if (nifty) newMarketData.push({ name: "NIFTY 50", price: nifty.price, change: nifty.change, changePercent: nifty.changePercent });
          if (sensex) newMarketData.push({ name: "SENSEX", price: sensex.price, change: sensex.change, changePercent: sensex.changePercent });
          if (usdInr) newMarketData.push({ name: "USD/INR", price: usdInr.price, change: usdInr.change, changePercent: usdInr.changePercent });
          if (gold) newMarketData.push({ name: "Gold", price: gold.price, change: gold.change, changePercent: gold.changePercent });
          if (crude) newMarketData.push({ name: "Crude Oil", price: crude.price, change: crude.change, changePercent: crude.changePercent });
          
          // Keep 10Y Yield as is since we don't have that data from our APIs
          newMarketData.push({ name: "10Y Yield", price: 7.142, change: 0.028, changePercent: 0.39 });
          
          if (newMarketData.length > 0) {
            setMarkets(newMarketData);
          }
        }
      } catch (error) {
        console.error("Failed to load market ticker data:", error);
      }
    };
    
    loadMarketData();
    
    // Refresh ticker data every 5 minutes
    const refreshTimer = setInterval(loadMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshTimer);
  }, []);

  return (
    <div className="w-full bg-background border-y border-border py-2 overflow-hidden">
      <div className="relative">
        <div className="flex animate-[marquee_30s_linear_infinite] space-x-8">
          {markets.map((market) => (
            <div key={market.name} className="flex items-center space-x-2 whitespace-nowrap px-4">
              <span className="font-medium text-muted-foreground">{market.name}</span>
              <span className="font-semibold">{market.price.toLocaleString('en-IN')}</span>
              <div className={cn(
                "flex items-center",
                market.change >= 0 ? "text-accent2" : "text-accent3"
              )}>
                {market.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>
                  {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} 
                  ({market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTickerLive;
