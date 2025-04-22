import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MiniMarketTable } from "@/components/ui/mini-market-table";
import type { MarketData } from "@/components/ui/market-table";

// Update the initial market data with correct values and flags
const INITIAL_MARKET_DATA: MarketData[] = [
  { flag: "🇮🇳", symbol: "NIFTY", name: "NIFTY 50", lastPrice: 22513.70, changePercent: 0.15, volume: 100000 },
  { flag: "🇮🇳", symbol: "SENSEX", name: "SENSEX", lastPrice: 74244.90, changePercent: 0.17, volume: 150000 },
  { flag: "🇺🇸", symbol: "SPX", name: "S&P 500", lastPrice: 5022.21, changePercent: -0.75, volume: 200000 },
  { flag: "🇺🇸", symbol: "DJI", name: "DOW", lastPrice: 37753.31, changePercent: -0.12, volume: 180000 },
  { flag: "🇺🇸", symbol: "NDX", name: "NASDAQ", lastPrice: 15580.87, changePercent: -1.15, volume: 220000 }
];

const INITIAL_STOCKS_DATA: MarketData[] = [
  { flag: "🇮🇳", symbol: "RELIANCE", name: "RELIANCE", lastPrice: 2912.75, changePercent: 0.52, volume: 5000000 },
  { flag: "🇮🇳", symbol: "TCS", name: "TCS", lastPrice: 3890.55, changePercent: 2.06, volume: 4500000 },
  { flag: "🇮🇳", symbol: "HDFCBANK", name: "HDFC BANK", lastPrice: 1521.65, changePercent: -1.40, volume: 6000000 },
  { flag: "🇮🇳", symbol: "ICICIBANK", name: "ICICI BANK", lastPrice: 1048.75, changePercent: 2.47, volume: 5500000 }
];

const INITIAL_CRYPTO_DATA: MarketData[] = [
  { flag: "₿", symbol: "BTC/USDT", name: "Bitcoin", lastPrice: 63245.80, changePercent: -2.22, volume: 25000 },
  { flag: "Ξ", symbol: "ETH/USDT", name: "Ethereum", lastPrice: 3075.45, changePercent: -0.96, volume: 35000 },
  { flag: "BNB", symbol: "BNB/USDT", name: "BNB", lastPrice: 575.65, changePercent: -0.96, volume: 15000 },
  { flag: "ADA", symbol: "ADA/USDT", name: "Cardano", lastPrice: 0.4485, changePercent: -0.84, volume: 20000 }
];

const INITIAL_COMMODITIES_DATA: MarketData[] = [
  { flag: "🏆", symbol: "GOLD", name: "Gold", lastPrice: 2383.75, changePercent: -0.36, volume: 150000 },
  { flag: "🛢️", symbol: "CL", name: "Crude Oil", lastPrice: 85.36, changePercent: 2.29, volume: 200000 },
  { flag: "🥈", symbol: "SILVER", name: "Silver", lastPrice: 28.32, changePercent: 1.25, volume: 180000 },
  { flag: "🔶", symbol: "COPPER", name: "Copper", lastPrice: 4.44, changePercent: 0.23, volume: 160000 }
];

const INITIAL_CURRENCIES_DATA: MarketData[] = [
  { flag: "💱", symbol: "USD/INR", name: "USD/INR", lastPrice: 83.47, changePercent: -0.05, volume: 500000 },
  { flag: "💶", symbol: "EUR/USD", name: "EUR/USD", lastPrice: 1.0621, changePercent: -0.29, volume: 600000 },
  { flag: "💴", symbol: "USD/JPY", name: "USD/JPY", lastPrice: 154.72, changePercent: 0.03, volume: 550000 }
];

const Markets = () => {
  const [activeTab, setActiveTab] = useState("indices");
  const [marketData, setMarketData] = useState<{
    indices: MarketData[];
    stocks: MarketData[];
    crypto: MarketData[];
    commodities: MarketData[];
    currencies: MarketData[];
  }>({
    indices: INITIAL_MARKET_DATA,
    stocks: INITIAL_STOCKS_DATA,
    crypto: INITIAL_CRYPTO_DATA,
    commodities: INITIAL_COMMODITIES_DATA,
    currencies: INITIAL_CURRENCIES_DATA
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [showAll, setShowAll] = useState<{
    indices: boolean;
    stocks: boolean;
    crypto: boolean;
    commodities: boolean;
    currencies: boolean;
  }>({
    indices: false,
    stocks: false,
    crypto: false,
    commodities: false,
    currencies: false
  });
  const initialDisplayCount = 3;

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "indices":
        return "Show All Indices";
      case "stocks":
        return "Show All Stocks";
      case "crypto":
        return "Show All Crypto";
      case "commodities":
        return "Show All Commodities";
      case "currencies":
        return "Show All Currencies";
      default:
        return "Show All";
    }
  };

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First try the TradingView API
      try {
        const response = await fetch('https://scanner.tradingview.com/forex/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbols: {
              tickers: [
                "NSE:NIFTY", "BSE:SENSEX", "INDEX:SPX", "INDEX:DJI", "INDEX:NDX",
                "NSE:RELIANCE", "NSE:TCS", "NSE:HDFCBANK", "NSE:INFY", "NSE:ICICIBANK",
                "BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:BNBUSDT", "BINANCE:ADAUSDT",
                "COMEX:GC", "NYMEX:CL", "COMEX:SI", "COMEX:HG",
                "FX:USDINR", "FX:EURUSD", "FX:GBPUSD", "FX:USDJPY"
              ],
              query: { types: [] }
            },
            columns: [
              "close", "change", "change_abs", "name", "high", "low", "open", "volume"
            ]
          })
        });

        if (!response.ok) {
          throw new Error('TradingView API failed');
        }

        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received');
        }

        const transformedData = {
          indices: data.data
            .filter((item: any) => item.d[3].includes("INDEX") || item.d[3].includes("NSE") || item.d[3].includes("BSE"))
            .map(transformMarketData),
          stocks: data.data
            .filter((item: any) => item.d[3].includes("NSE:") && !item.d[3].includes("INDEX"))
            .map(transformMarketData),
          crypto: data.data
            .filter((item: any) => item.d[3].includes("BINANCE:"))
            .map(transformMarketData),
          commodities: data.data
            .filter((item: any) => item.d[3].includes("COMEX:") || item.d[3].includes("NYMEX:"))
            .map(transformMarketData),
          currencies: data.data
            .filter((item: any) => item.d[3].includes("FX:"))
            .map(transformMarketData)
        };

        setMarketData(transformedData);
        setLastUpdated(new Date());
        setRetryCount(0);
        return;
      } catch (tradingViewError) {
        console.error('TradingView API failed, falling back to initial data:', tradingViewError);
      }

      // If TradingView API fails, use the initial data
      setMarketData({
        indices: INITIAL_MARKET_DATA,
        stocks: INITIAL_STOCKS_DATA,
        crypto: INITIAL_CRYPTO_DATA,
        commodities: INITIAL_COMMODITIES_DATA,
        currencies: INITIAL_CURRENCIES_DATA
      });
      setLastUpdated(new Date());
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError('Failed to fetch live data');
      
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMarketData();
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const transformMarketData = (item: any): MarketData => ({
    symbol: item.d[3].split(":")[1],
    name: item.d[3].split(":")[1],
    lastPrice: item.d[0],
    changePercent: item.d[1],
    volume: Number(item.d[7]) || 0,
    flag: getFlag(item.d[3])
  });

  const getFlag = (symbol: string): string => {
    if (symbol.includes("NSE:") || symbol.includes("BSE:")) return "🇮🇳";
    if (symbol.includes("INDEX:")) return "🇺🇸";
    if (symbol.includes("BINANCE:")) return "₿";
    if (symbol.includes("COMEX:") || symbol.includes("NYMEX:")) {
      if (symbol.includes("GC")) return "🏆";
      if (symbol.includes("CL")) return "🛢️";
      if (symbol.includes("SI")) return "🥈";
      if (symbol.includes("HG")) return "🔶";
    }
    if (symbol.includes("FX:")) {
      if (symbol.includes("USDINR")) return "🇮🇳";
      if (symbol.includes("EURUSD")) return "💶";
      if (symbol.includes("GBPUSD")) return "💷";
      if (symbol.includes("USDJPY")) return "💴";
    }
    return "";
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const toggleShowAll = (tab: string) => {
    setShowAll(prev => ({
      ...prev,
      [tab]: !prev[tab as keyof typeof prev]
    }));
  };

  const getDisplayData = (data: MarketData[], tab: string) => {
    if (showAll[tab as keyof typeof showAll]) {
      return data;
    }
    return data.slice(0, initialDisplayCount);
  };

  const indices: MarketData[] = [
    { 
      flag: "/flags/in.svg",
      symbol: "NIFTY", 
      name: "Nifty 50", 
      lastPrice: 22147.50, 
      changePercent: 0.56,
      volume: 1000000
    },
    { 
      flag: "/flags/in.svg",
      symbol: "SENSEX", 
      name: "Sensex", 
      lastPrice: 73058.24, 
      changePercent: 0.63,
      volume: 1500000
    }
  ];

  const stocks: MarketData[] = [
    { 
      flag: "/flags/in.svg",
      symbol: "RELIANCE", 
      name: "Reliance Industries", 
      lastPrice: 2934.50, 
      changePercent: 1.58,
      volume: 5234567
    },
    { 
      flag: "/flags/in.svg",
      symbol: "TCS", 
      name: "Tata Consultancy", 
      lastPrice: 3876.25, 
      changePercent: -0.60,
      volume: 1234567
    }
  ];

  const crypto: MarketData[] = [
    { 
      symbol: "BTC", 
      name: "Bitcoin", 
      lastPrice: 67890.12, 
      changePercent: 1.85,
      volume: 45678901234
    },
    { 
      symbol: "ETH", 
      name: "Ethereum", 
      lastPrice: 3456.78, 
      changePercent: -1.31,
      volume: 23456789012
    }
  ];

  const commodities: MarketData[] = [
    { 
      symbol: "GOLD", 
      name: "Gold", 
      lastPrice: 2367.50, 
      changePercent: 1.85,
      volume: 150000
    },
    { 
      symbol: "SILVER", 
      name: "Silver", 
      lastPrice: 28.45, 
      changePercent: 1.59,
      volume: 180000
    }
  ];

  const currencies: MarketData[] = [
    { 
      flag: "/flags/us.svg",
      symbol: "USD/INR", 
      name: "US Dollar", 
      lastPrice: 83.2456, 
      changePercent: -0.15,
      volume: 500000
    },
    { 
      flag: "/flags/eu.svg",
      symbol: "EUR/INR", 
      name: "Euro", 
      lastPrice: 89.8765, 
      changePercent: 0.26,
      volume: 600000
    }
  ];

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white sticky top-0 z-20">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent1" />
          Markets
        </CardTitle>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button 
            variant="outline"
            size="sm" 
            onClick={fetchMarketData}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <MiniMarketTable 
            title="Indices" 
            data={marketData.indices} 
            maxRows={5}
            tabValue="indices"
          />
          <MiniMarketTable 
            title="Stocks" 
            data={marketData.stocks} 
            showVolume 
            maxRows={5}
            tabValue="stocks"
          />
          <MiniMarketTable 
            title="Crypto" 
            data={marketData.crypto} 
            showVolume 
            maxRows={5}
            tabValue="crypto"
          />
          <MiniMarketTable 
            title="Commodities" 
            data={marketData.commodities} 
            maxRows={5}
            tabValue="commodities"
          />
          <MiniMarketTable 
            title="Currencies" 
            data={marketData.currencies} 
            maxRows={5}
            tabValue="currencies"
          />
        </div>
        {marketData.indices.length > initialDisplayCount && (
          <div className="flex justify-center py-3 border-t border-gray-200 bg-white sticky bottom-0">
            <Link to="/data-dashboard/markets?tab=indices">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-accent1 hover:text-accent1/90"
              >
                Show All Indices <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {marketData.stocks.length > initialDisplayCount && (
          <div className="flex justify-center py-3 border-t border-gray-200 bg-white sticky bottom-0">
            <Link to="/data-dashboard/markets?tab=stocks">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-accent1 hover:text-accent1/90"
              >
                Show All Stocks <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {marketData.crypto.length > initialDisplayCount && (
          <div className="flex justify-center py-3 border-t border-gray-200 bg-white sticky bottom-0">
            <Link to="/data-dashboard/markets?tab=crypto">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-accent1 hover:text-accent1/90"
              >
                Show All Crypto <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {marketData.commodities.length > initialDisplayCount && (
          <div className="flex justify-center py-3 border-t border-gray-200 bg-white sticky bottom-0">
            <Link to="/data-dashboard/markets?tab=commodities">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-accent1 hover:text-accent1/90"
              >
                Show All Commodities <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {marketData.currencies.length > initialDisplayCount && (
          <div className="flex justify-center py-3 border-t border-gray-200 bg-white sticky bottom-0">
            <Link to="/data-dashboard/markets?tab=currencies">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-accent1 hover:text-accent1/90"
              >
                Show All Currencies <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
            <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>Flag</span>
                    <span>Name</span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Chg.</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Chg. %</th>
                <th scope="col" className="hidden md:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">High</th>
                <th scope="col" className="hidden md:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Low</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading market data...
                    </div>
                  </td>
                </tr>
              ) : (
                getDisplayData(marketData.indices, "indices").map((index) => (
                  <tr key={index.name} className="hover:bg-gray-50 transition-colors">
                    <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{index.flag}</span>
                        <span className="font-medium">{index.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{index.lastPrice.toLocaleString()}</td>
                    <td className={cn(
                      "px-6 py-4 whitespace-nowrap text-right",
                      index.changePercent >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}
                    </td>
                    <td className={cn(
                      "px-6 py-4 whitespace-nowrap text-right",
                        index.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-right">{index.high?.toLocaleString() || '-'}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-right">{index.low?.toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 text-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Markets;
