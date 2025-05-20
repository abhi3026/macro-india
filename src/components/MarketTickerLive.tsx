
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketData = {
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

const MarketTickerLive = () => {
  // Mock market data - in a real app, this would come from an API
  const [markets] = useState<MarketData[]>([
    { name: "NIFTY 50", price: 21567.42, change: 127.35, changePercent: 0.59 },
    { name: "SENSEX", price: 70808.47, change: 423.95, changePercent: 0.60 },
    { name: "USD/INR", price: 82.95, change: -0.12, changePercent: -0.14 },
    { name: "Gold", price: 62420.00, change: 320.00, changePercent: 0.52 },
    { name: "Crude Oil", price: 6190.00, change: -51.00, changePercent: -0.82 },
    { name: "10Y Yield", price: 7.142, change: 0.028, changePercent: 0.39 },
  ]);

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
