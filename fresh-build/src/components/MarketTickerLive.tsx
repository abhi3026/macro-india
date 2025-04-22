
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
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Set refresh interval to 30 seconds
const REFRESH_INTERVAL = 30 * 1000; // 30 seconds in milliseconds

const MarketTickerLive = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasFetchFailed, setHasFetchFailed] = useState<boolean>(false);
  const initialLoadCompleted = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Initialize with fallback data immediately to prevent flickering
  useEffect(() => {
    // Always set initial static data immediately to prevent flickering
    setMarkets(generateFallbackData());
  }, []);

  const fetchData = async (showToast = false) => {
    if (isRefreshing) return; // Prevent concurrent fetch operations
    
    setIsRefreshing(true);
    try {
      // Try to fetch real data
      const data = await fetchMarketData();
      setMarkets(data);
      setLastUpdated(new Date());
      setHasFetchFailed(false);
      initialLoadCompleted.current = true;
      
      if (showToast) {
        toast({
          title: "Market data updated successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setHasFetchFailed(true);
      
      // If error occurs and we don't have any data yet, ensure we have fallback data
      if (!initialLoadCompleted.current) {
        setMarkets(generateFallbackData());
        initialLoadCompleted.current = true;
      }
      
      if (showToast) {
        toast({
          title: "Update Failed",
          description: "Using fallback market data due to API error",
          variant: "destructive",
        });
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
    // Initial data fetch after a short delay to allow fallback data to render first
    const initialFetchTimeout = setTimeout(() => {
      fetchData();
    }, 500);

    // Set up the refresh interval
    timeoutRef.current = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialFetchTimeout);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  // Fallback static content if all APIs fail
  if (hasFetchFailed && markets.every(m => m.error)) {
    return (
      <div className="w-full bg-indianmacro-100 py-2 relative overflow-hidden border-y border-indianmacro-200">
        <div className="flex items-center justify-center text-indianmacro-700 py-2">
          <AlertCircle className="h-4 w-4 mr-2 text-accent3" />
          <span>Live market data temporarily unavailable. Please check back later.</span>
          <button
            onClick={handleManualRefresh}
            className="ml-2 p-1 rounded-full hover:bg-indianmacro-200 text-indianmacro-600 transition-all"
            title="Retry loading market data"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </div>
    );
  }

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
                        {symbolDetails ? formatPrice(market.price, symbolDetails.type, market.currency) : market.price.toLocaleString('en-IN')}
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
                        {symbolDetails ? formatPrice(market.price, symbolDetails.type, market.currency) : market.price.toLocaleString('en-IN')}
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
