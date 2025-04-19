
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

interface MarketIndex {
  name: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
  flag?: string;
  high?: number;
  low?: number;
  open?: number;
  volume?: string;
}

interface Stock {
  name: string;
  ticker: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
  high?: number;
  low?: number;
  volume?: string;
}

interface Crypto {
  name: string;
  symbol: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
  marketCap?: string;
  volume24h?: string;
}

interface Commodity {
  name: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
  unit: string;
}

interface Currency {
  name: string;
  symbol: string;
  last: number;
  change: number;
  changePercent: number;
  time: string;
}

// Initial market data
const INITIAL_MARKET_DATA: MarketIndex[] = [
  {
    name: "Dow Jones",
    last: 39142.23,
    change: -527.16,
    changePercent: -1.33,
    time: "17/04",
    flag: "🇺🇸",
    high: 39745.58,
    low: 38950.31,
  },
  {
    name: "Nasdaq",
    last: 16286.45,
    change: -20.71,
    changePercent: -0.13,
    time: "17/04",
    flag: "🇺🇸",
    high: 16408.51,
    low: 16181.17,
  },
  {
    name: "S&P 500",
    last: 5282.70,
    change: 7.00,
    changePercent: 0.13,
    time: "17/04",
    flag: "🇺🇸",
    high: 5328.31,
    low: 5255.58,
  },
  {
    name: "FTSE 100",
    last: 8092.12,
    change: 14.45,
    changePercent: 0.18,
    time: "17/04",
    flag: "🇬🇧",
    high: 8102.23,
    low: 8065.47,
  },
  {
    name: "DAX",
    last: 21205.86,
    change: -105.16,
    changePercent: -0.49,
    time: "17/04",
    flag: "🇩🇪",
    high: 21436.66,
    low: 21142.26,
  },
  {
    name: "Nikkei 225",
    last: 38437.95,
    change: -85.23,
    changePercent: -0.22,
    time: "17/04",
    flag: "🇯🇵",
    high: 38565.42,
    low: 38315.67,
  },
  {
    name: "Sensex",
    last: 73927.88,
    change: 335.39,
    changePercent: 0.46,
    time: "17/04",
    flag: "🇮🇳",
    high: 74052.21,
    low: 73678.92,
  },
  {
    name: "Nifty 50",
    last: 22452.18,
    change: 83.45,
    changePercent: 0.37,
    time: "17/04",
    flag: "🇮🇳",
    high: 22495.70,
    low: 22375.83,
  }
];

const INITIAL_STOCKS_DATA: Stock[] = [
  { name: "Reliance Industries", ticker: "RELIANCE.NS", last: 2897.65, change: 12.35, changePercent: 0.43, time: "17/04", high: 2905.40, low: 2880.10 },
  { name: "TCS", ticker: "TCS.NS", last: 3712.85, change: -23.45, changePercent: -0.63, time: "17/04", high: 3752.20, low: 3700.15 },
  { name: "HDFC Bank", ticker: "HDFCBANK.NS", last: 1543.20, change: 7.85, changePercent: 0.51, time: "17/04", high: 1550.00, low: 1535.60 },
  { name: "Infosys", ticker: "INFY.NS", last: 1378.50, change: -15.70, changePercent: -1.13, time: "17/04", high: 1395.80, low: 1372.40 },
  { name: "ITC", ticker: "ITC.NS", last: 421.95, change: 3.25, changePercent: 0.78, time: "17/04", high: 423.50, low: 418.70 },
  { name: "SBI", ticker: "SBIN.NS", last: 773.85, change: 8.20, changePercent: 1.07, time: "17/04", high: 776.40, low: 765.30 },
  { name: "Hindustan Unilever", ticker: "HINDUNILVR.NS", last: 2256.35, change: -9.80, changePercent: -0.43, time: "17/04", high: 2270.00, low: 2250.10 },
  { name: "Bajaj Finance", ticker: "BAJFINANCE.NS", last: 6985.45, change: 85.30, changePercent: 1.24, time: "17/04", high: 7012.20, low: 6920.60 }
];

const INITIAL_CRYPTO_DATA: Crypto[] = [
  { name: "Bitcoin", symbol: "BTC", last: 65423.50, change: 1432.78, changePercent: 2.24, time: "17/04", marketCap: "1.28T", volume24h: "48.7B" },
  { name: "Ethereum", symbol: "ETH", last: 3105.67, change: 65.23, changePercent: 2.15, time: "17/04", marketCap: "373.3B", volume24h: "21.5B" },
  { name: "BNB", symbol: "BNB", last: 581.23, change: -5.67, changePercent: -0.97, time: "17/04", marketCap: "87.2B", volume24h: "2.1B" },
  { name: "Solana", symbol: "SOL", last: 148.35, change: 6.78, changePercent: 4.79, time: "17/04", marketCap: "64.5B", volume24h: "3.7B" },
  { name: "XRP", symbol: "XRP", last: 0.5067, change: -0.0134, changePercent: -2.58, time: "17/04", marketCap: "28.2B", volume24h: "1.8B" },
  { name: "Cardano", symbol: "ADA", last: 0.4523, change: 0.0078, changePercent: 1.75, time: "17/04", marketCap: "16.1B", volume24h: "678.4M" },
  { name: "Dogecoin", symbol: "DOGE", last: 0.1567, change: 0.0043, changePercent: 2.82, time: "17/04", marketCap: "22.5B", volume24h: "1.3B" },
  { name: "Polkadot", symbol: "DOT", last: 7.38, change: -0.12, changePercent: -1.60, time: "17/04", marketCap: "10.9B", volume24h: "384.2M" }
];

const INITIAL_COMMODITIES_DATA: Commodity[] = [
  { name: "Gold", last: 2392.45, change: 18.35, changePercent: 0.77, time: "17/04", unit: "USD/oz" },
  { name: "Silver", last: 28.67, change: 0.42, changePercent: 1.49, time: "17/04", unit: "USD/oz" },
  { name: "Crude Oil (WTI)", last: 83.45, change: -1.23, changePercent: -1.45, time: "17/04", unit: "USD/bbl" },
  { name: "Brent Oil", last: 87.21, change: -0.98, changePercent: -1.11, time: "17/04", unit: "USD/bbl" },
  { name: "Natural Gas", last: 1.762, change: 0.037, changePercent: 2.15, time: "17/04", unit: "USD/MMBtu" },
  { name: "Copper", last: 4.43, change: 0.05, changePercent: 1.14, time: "17/04", unit: "USD/lb" },
  { name: "Aluminum", last: 2378.50, change: 15.25, changePercent: 0.65, time: "17/04", unit: "USD/t" },
  { name: "Wheat", last: 625.75, change: -8.25, changePercent: -1.30, time: "17/04", unit: "USc/bu" }
];

const INITIAL_CURRENCIES_DATA: Currency[] = [
  { name: "EUR/USD", symbol: "€/$", last: 1.0672, change: 0.0015, changePercent: 0.14, time: "17/04" },
  { name: "USD/JPY", symbol: "$/*", last: 154.67, change: 0.23, changePercent: 0.15, time: "17/04" },
  { name: "GBP/USD", symbol: "£/$", last: 1.2462, change: -0.0018, changePercent: -0.14, time: "17/04" },
  { name: "USD/INR", symbol: "$/₹", last: 83.51, change: -0.07, changePercent: -0.08, time: "17/04" },
  { name: "USD/CAD", symbol: "$/C$", last: 1.3752, change: 0.0021, changePercent: 0.15, time: "17/04" },
  { name: "USD/CNY", symbol: "$/¥", last: 7.2436, change: -0.0045, changePercent: -0.06, time: "17/04" },
  { name: "AUD/USD", symbol: "A$/$", last: 0.6521, change: 0.0023, changePercent: 0.35, time: "17/04" },
  { name: "NZD/USD", symbol: "NZ$/$", last: 0.5943, change: 0.0015, changePercent: 0.25, time: "17/04" }
];

const Markets = () => {
  const [activeTab, setActiveTab] = useState("indices");
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>(INITIAL_MARKET_DATA);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS_DATA);
  const [cryptos, setCryptos] = useState<Crypto[]>(INITIAL_CRYPTO_DATA);
  const [commodities, setCommodities] = useState<Commodity[]>(INITIAL_COMMODITIES_DATA);
  const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES_DATA);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());

  // Function to simulate refreshing market data without causing flickering
  const refreshMarketData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate small changes to avoid flickering
      
      // Create a timestamp to ensure React recognizes the state change
      const timestamp = Date.now();
      setRefreshTimestamp(timestamp);
      
      setTimeout(() => {
        // Update data based on active tab
        if (activeTab === "indices") {
          const updatedData = marketIndices.map(index => {
            const changeDirection = Math.random() > 0.5 ? 1 : -1;
            const changeAmount = (Math.random() * 0.2) * changeDirection;
            const newLast = +(index.last * (1 + changeAmount / 100)).toFixed(2);
            const change = +(newLast - index.last).toFixed(2);
            const changePercent = +((change / index.last) * 100).toFixed(2);
            
            return {
              ...index,
              last: newLast,
              change,
              changePercent,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });
          
          setMarketIndices(updatedData);
        } else if (activeTab === "stocks") {
          const updatedStocks = stocks.map(stock => {
            const changeDirection = Math.random() > 0.5 ? 1 : -1;
            const changeAmount = (Math.random() * 0.3) * changeDirection;
            const newLast = +(stock.last * (1 + changeAmount / 100)).toFixed(2);
            const change = +(newLast - stock.last).toFixed(2);
            const changePercent = +((change / stock.last) * 100).toFixed(2);
            
            return {
              ...stock,
              last: newLast,
              change,
              changePercent,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });
          
          setStocks(updatedStocks);
        } else if (activeTab === "crypto") {
          const updatedCryptos = cryptos.map(crypto => {
            const changeDirection = Math.random() > 0.5 ? 1 : -1;
            const changeAmount = (Math.random() * 0.5) * changeDirection;
            const newLast = +(crypto.last * (1 + changeAmount / 100)).toFixed(2);
            const change = +(newLast - crypto.last).toFixed(2);
            const changePercent = +((change / crypto.last) * 100).toFixed(2);
            
            return {
              ...crypto,
              last: newLast,
              change,
              changePercent,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });
          
          setCryptos(updatedCryptos);
        } else if (activeTab === "commodities") {
          const updatedCommodities = commodities.map(commodity => {
            const changeDirection = Math.random() > 0.5 ? 1 : -1;
            const changeAmount = (Math.random() * 0.3) * changeDirection;
            const newLast = +(commodity.last * (1 + changeAmount / 100)).toFixed(2);
            const change = +(newLast - commodity.last).toFixed(2);
            const changePercent = +((change / commodity.last) * 100).toFixed(2);
            
            return {
              ...commodity,
              last: newLast,
              change,
              changePercent,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });
          
          setCommodities(updatedCommodities);
        } else if (activeTab === "currencies") {
          const updatedCurrencies = currencies.map(currency => {
            const changeDirection = Math.random() > 0.5 ? 1 : -1;
            const changeAmount = (Math.random() * 0.2) * changeDirection;
            const newLast = +(currency.last * (1 + changeAmount / 100)).toFixed(4);
            const change = +(newLast - currency.last).toFixed(4);
            const changePercent = +((change / currency.last) * 100).toFixed(2);
            
            return {
              ...currency,
              last: newLast,
              change,
              changePercent,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });
          
          setCurrencies(updatedCurrencies);
        }
        
        setLastUpdated(new Date());
        setIsRefreshing(false);
      }, 300); // Small delay to avoid UI jank
    } catch (error) {
      console.error("Error refreshing market data", error);
      toast({
        title: "Failed to update market data",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsRefreshing(false);
    }
  }, [activeTab, marketIndices, stocks, cryptos, commodities, currencies, isRefreshing]);

  // Auto-refresh market data every 60 seconds
  useEffect(() => {
    refreshMarketData();
    
    const intervalId = setInterval(() => {
      refreshMarketData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refreshMarketData]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Markets</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={refreshMarketData}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="indices" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="w-full mb-4 grid grid-cols-5">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indices" className="mt-0">
            <div className="overflow-x-auto">
              <Table key={`indices-${refreshTimestamp}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="text-right font-medium">Last</TableHead>
                    <TableHead className="text-right font-medium">Chg.</TableHead>
                    <TableHead className="text-right font-medium">Chg. %</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">High</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">Low</TableHead>
                    <TableHead className="text-right font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketIndices.map((index) => (
                    <TableRow key={index.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{index.flag}</span>
                          <span>{index.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{index.last.toLocaleString()}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        index.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {index.change >= 0 ? '+' : ''}{index.change.toLocaleString()}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        index.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {index.high?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {index.low?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell className="text-right">{index.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="stocks" className="mt-0">
            <div className="overflow-x-auto">
              <Table key={`stocks-${refreshTimestamp}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="text-right font-medium">Last</TableHead>
                    <TableHead className="text-right font-medium">Chg.</TableHead>
                    <TableHead className="text-right font-medium">Chg. %</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">High</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">Low</TableHead>
                    <TableHead className="text-right font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.ticker}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{stock.name}</span>
                          <span className="text-xs text-muted-foreground">{stock.ticker}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{stock.last.toLocaleString()}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        stock.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toLocaleString()}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {stock.high?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {stock.low?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell className="text-right">{stock.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-0">
            <div className="overflow-x-auto">
              <Table key={`crypto-${refreshTimestamp}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="text-right font-medium">Last</TableHead>
                    <TableHead className="text-right font-medium">Chg.</TableHead>
                    <TableHead className="text-right font-medium">Chg. %</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">Market Cap</TableHead>
                    <TableHead className="text-right font-medium hidden md:table-cell">Volume (24h)</TableHead>
                    <TableHead className="text-right font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptos.map((crypto) => (
                    <TableRow key={crypto.symbol}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{crypto.name}</span>
                          <span className="text-xs text-muted-foreground">{crypto.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${crypto.last.toLocaleString()}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        crypto.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {crypto.change >= 0 ? '+' : ''}${crypto.change.toLocaleString()}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        crypto.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {crypto.marketCap || "-"}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {crypto.volume24h || "-"}
                      </TableCell>
                      <TableCell className="text-right">{crypto.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="commodities" className="mt-0">
            <div className="overflow-x-auto">
              <Table key={`commodities-${refreshTimestamp}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="text-right font-medium">Last</TableHead>
                    <TableHead className="text-right font-medium">Chg.</TableHead>
                    <TableHead className="text-right font-medium">Chg. %</TableHead>
                    <TableHead className="text-right font-medium">Unit</TableHead>
                    <TableHead className="text-right font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commodities.map((commodity) => (
                    <TableRow key={commodity.name}>
                      <TableCell>
                        <span>{commodity.name}</span>
                      </TableCell>
                      <TableCell className="text-right">{commodity.last.toLocaleString()}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        commodity.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {commodity.change >= 0 ? '+' : ''}{commodity.change.toLocaleString()}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        commodity.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{commodity.unit}</TableCell>
                      <TableCell className="text-right">{commodity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="currencies" className="mt-0">
            <div className="overflow-x-auto">
              <Table key={`currencies-${refreshTimestamp}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Pair</TableHead>
                    <TableHead className="text-right font-medium">Last</TableHead>
                    <TableHead className="text-right font-medium">Chg.</TableHead>
                    <TableHead className="text-right font-medium">Chg. %</TableHead>
                    <TableHead className="text-right font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.map((currency) => (
                    <TableRow key={currency.name}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{currency.name}</span>
                          <span className="text-xs text-muted-foreground">{currency.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{currency.last.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        currency.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {currency.change >= 0 ? '+' : ''}{currency.change.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        currency.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {currency.changePercent >= 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{currency.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-center">
          <Button asChild className="group">
            <Link to="/live-markets" className="flex items-center gap-2">
              Show All Indices
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Markets;
