
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  fetchMarketData, 
  generateFallbackData, 
  marketSymbols, 
  MarketData,
  getSymbolDetails,
  formatPrice
} from "@/lib/marketData";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LiveMarketDataPage = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Initial data fetch
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // Try to fetch real data
      const data = await fetchMarketData();
      setMarkets(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching market data:", error);
      
      // If error occurs and we don't have any data yet, use fallback
      if (markets.length === 0) {
        const fallbackData = generateFallbackData();
        setMarkets(fallbackData);
        toast.error("Using fallback market data due to API error");
      } else {
        toast.error("Failed to refresh market data");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Group market data by type
  const indianIndices = markets.filter(m => {
    const details = getSymbolDetails(m.symbol);
    return details?.type === "index" && (m.symbol.includes("^NSE") || m.symbol.includes("^BSE"));
  });
  
  const globalIndices = markets.filter(m => {
    const details = getSymbolDetails(m.symbol);
    return details?.type === "index" && !(m.symbol.includes("^NSE") || m.symbol.includes("^BSE"));
  });
  
  const forex = markets.filter(m => {
    const details = getSymbolDetails(m.symbol);
    return details?.type === "forex";
  });
  
  const commodities = markets.filter(m => {
    const details = getSymbolDetails(m.symbol);
    return details?.type === "commodity";
  });
  
  const crypto = markets.filter(m => {
    const details = getSymbolDetails(m.symbol);
    return details?.type === "crypto";
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MarketTickerLive />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-indianmacro-900">Live Market Data</h1>
              <p className="text-indianmacro-600 mt-1">Real-time financial market information</p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
          
          {lastUpdated && (
            <p className="text-indianmacro-500 text-sm mb-6">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
          
          <Tabs defaultValue="indian" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="indian">Indian Markets</TabsTrigger>
              <TabsTrigger value="global">Global Markets</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
              <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="indian" className="space-y-6">
              <h2 className="text-xl font-semibold text-indianmacro-800">Indian Indices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardHeader className="pb-2">
                        <div className="h-5 w-24 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-36 bg-indianmacro-200 animate-pulse rounded mb-3"></div>
                        <div className="h-5 w-20 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  indianIndices.map(market => (
                    <MarketCard key={market.symbol} market={market} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="global" className="space-y-6">
              <h2 className="text-xl font-semibold text-indianmacro-800">Global Indices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardHeader className="pb-2">
                        <div className="h-5 w-24 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-36 bg-indianmacro-200 animate-pulse rounded mb-3"></div>
                        <div className="h-5 w-20 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  globalIndices.map(market => (
                    <MarketCard key={market.symbol} market={market} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="forex" className="space-y-6">
              <h2 className="text-xl font-semibold text-indianmacro-800">Currency Exchange Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardHeader className="pb-2">
                        <div className="h-5 w-24 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-36 bg-indianmacro-200 animate-pulse rounded mb-3"></div>
                        <div className="h-5 w-20 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  forex.map(market => (
                    <MarketCard key={market.symbol} market={market} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="commodities" className="space-y-6">
              <h2 className="text-xl font-semibold text-indianmacro-800">Commodities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardHeader className="pb-2">
                        <div className="h-5 w-24 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-36 bg-indianmacro-200 animate-pulse rounded mb-3"></div>
                        <div className="h-5 w-20 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  commodities.map(market => (
                    <MarketCard key={market.symbol} market={market} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="crypto" className="space-y-6">
              <h2 className="text-xl font-semibold text-indianmacro-800">Cryptocurrencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardHeader className="pb-2">
                        <div className="h-5 w-24 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-36 bg-indianmacro-200 animate-pulse rounded mb-3"></div>
                        <div className="h-5 w-20 bg-indianmacro-200 animate-pulse rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  crypto.map(market => (
                    <MarketCard key={market.symbol} market={market} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-10 border-t border-indianmacro-200 pt-6">
            <p className="text-indianmacro-500 text-sm">
              <strong>Note:</strong> Market data is refreshed automatically every 5 minutes. You can also manually refresh using the button above.
              Data is sourced from public APIs and may be delayed by 15-20 minutes for some markets.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Market Card Component
const MarketCard = ({ market }: { market: MarketData }) => {
  const symbolDetails = getSymbolDetails(market.symbol);
  
  if (market.error) {
    return (
      <Card className="bg-white border-indianmacro-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{market.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-indianmacro-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Data unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white border-indianmacro-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{market.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {symbolDetails ? formatPrice(market.price, symbolDetails.type) : market.price.toLocaleString('en-IN')}
        </div>
        <div className={cn(
          "flex items-center text-sm font-medium",
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
      </CardContent>
    </Card>
  );
};

export default LiveMarketDataPage;
