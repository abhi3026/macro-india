
import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  MarketData, 
  fetchMarketData, 
  getInitialMarketData, 
  generateFallbackData,
  getSymbolDetails,
  formatPrice
} from "@/lib/marketData";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const MarketTickerLive = () => {
  const [markets, setMarkets] = useState<MarketData[]>(getInitialMarketData());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const fetchData = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      // Try to fetch real data
      const data = await fetchMarketData();
      setMarkets(data);
      setLastUpdated(new Date());
      if (showToast) {
        toast.success("Market data updated successfully");
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      
      // If error occurs and we don't have any data yet, use fallback
      if (markets.every(m => m.loading)) {
        const fallbackData = generateFallbackData();
        setMarkets(fallbackData);
        if (showToast) {
          toast.error("Using fallback market data due to API error");
        }
      } else if (showToast) {
        toast.error("Failed to refresh market data");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchData(true); // Show toast on manual refresh
  };

  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Set up the refresh interval
    timeoutRef.current = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-indianmacro-100 py-2 relative overflow-hidden border-y border-indianmacro-200">
      <div className={cn(
        "flex items-center z-10 bg-indianmacro-100 pl-2",
        isMobile ? "absolute right-2 top-0" : "absolute right-2 top-1/2 transform -translate-y-1/2"
      )}>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="p-1 rounded-full hover:bg-indianmacro-200 text-indianmacro-600 transition-all"
          title="Refresh market data"
        >
          <RefreshCw className={cn(
            "h-4 w-4",
            isRefreshing && "animate-spin"
          )} />
        </button>
        <div className="text-xs text-indianmacro-500 ml-1">
          {isLoading ? "Loading..." : `Updated: ${lastUpdated.toLocaleTimeString()}`}
        </div>
      </div>

      <div className="ticker-container overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {markets.map((market) => {
            const symbolDetails = getSymbolDetails(market.symbol);
            return (
              <div key={market.symbol} className="inline-block px-3">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="font-medium text-indianmacro-700">{market.name}</span>
                  {market.error ? (
                    <div className="flex items-center text-indianmacro-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>N/A</span>
                    </div>
                  ) : market.loading ? (
                    <div className="w-20 h-4 bg-indianmacro-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {symbolDetails ? formatPrice(market.price, symbolDetails.type) : market.price.toLocaleString('en-IN')}
                      </span>
                      <div className={cn(
                        "flex items-center",
                        market.change >= 0 ? "text-accent2" : "text-accent3"
                      )}>
                        {market.change >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 mr-1" />
                        )}
                        <span className="text-sm">
                          {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} 
                          ({market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Duplicate content for seamless looping */}
        <div className="animate-marquee2 whitespace-nowrap">
          {markets.map((market) => {
            const symbolDetails = getSymbolDetails(market.symbol);
            return (
              <div key={`dup-${market.symbol}`} className="inline-block px-3">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="font-medium text-indianmacro-700">{market.name}</span>
                  {market.error ? (
                    <div className="flex items-center text-indianmacro-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>N/A</span>
                    </div>
                  ) : market.loading ? (
                    <div className="w-20 h-4 bg-indianmacro-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {symbolDetails ? formatPrice(market.price, symbolDetails.type) : market.price.toLocaleString('en-IN')}
                      </span>
                      <div className={cn(
                        "flex items-center",
                        market.change >= 0 ? "text-accent2" : "text-accent3"
                      )}>
                        {market.change >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 mr-1" />
                        )}
                        <span className="text-sm">
                          {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} 
                          ({market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketTickerLive;
