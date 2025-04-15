
import { toast } from "sonner";

// Define types for our market data
export type MarketSymbol = {
  id: string;
  name: string;
  symbol: string;
  type: "index" | "forex" | "commodity" | "crypto";
  displayName?: string;
};

export type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
  loading?: boolean;
  error?: boolean;
};

// Market symbols configuration - these can be easily added/removed later
export const marketSymbols: MarketSymbol[] = [
  { id: "nifty50", name: "NIFTY 50", symbol: "^NSEI", type: "index" },
  { id: "sensex", name: "SENSEX", symbol: "^BSESN", type: "index" },
  { id: "banknifty", name: "BANK NIFTY", symbol: "^NSEBANK", type: "index" },
  { id: "nasdaq", name: "NASDAQ", symbol: "^IXIC", type: "index" },
  { id: "sp500", name: "S&P 500", symbol: "^GSPC", type: "index" },
  { id: "dowjones", name: "DOW JONES", symbol: "^DJI", type: "index" },
  { id: "nikkei", name: "NIKKEI 225", symbol: "^N225", type: "index" },
  { id: "hangseng", name: "HANG SENG", symbol: "^HSI", type: "index" },
  { id: "usdinr", name: "USD/INR", symbol: "INR=X", type: "forex", displayName: "USD/INR" },
  { id: "eurusd", name: "EUR/USD", symbol: "EURUSD=X", type: "forex", displayName: "EUR/USD" },
  { id: "jpyinr", name: "JPY/INR", symbol: "JPYINR=X", type: "forex", displayName: "JPY/INR" },
  { id: "gold", name: "Gold", symbol: "GC=F", type: "commodity" },
  { id: "silver", name: "Silver", symbol: "SI=F", type: "commodity" },
  { id: "brentcrudeoil", name: "Brent Crude Oil", symbol: "BZ=F", type: "commodity", displayName: "Crude Oil" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC-USD", type: "crypto", displayName: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH-USD", type: "crypto", displayName: "ETH" },
];

// Mock data for fallback
export const getInitialMarketData = (): MarketData[] => {
  return marketSymbols.map(sym => ({
    symbol: sym.symbol,
    name: sym.displayName || sym.name,
    price: 0,
    change: 0,
    changePercent: 0,
    lastUpdated: new Date(),
    loading: true,
  }));
};

// Format currency based on type
export const formatPrice = (price: number, type: string): string => {
  if (type === "crypto") {
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  } else if (type === "forex") {
    return price.toLocaleString('en-IN', { maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
};

// Yahoo Finance API integration (using a proxy to avoid CORS issues)
export const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    // Create a list of symbols for the batch request
    const symbolsParam = marketSymbols.map(item => item.symbol).join(",");
    
    // Using Yahoo Finance API
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch market data");
    }
    
    const data = await response.json();
    
    if (!data.quoteResponse || !data.quoteResponse.result) {
      throw new Error("Invalid response format");
    }
    
    const results = data.quoteResponse.result;
    
    // Map API response to our MarketData type
    return marketSymbols.map(marketSymbol => {
      const quote = results.find((item: any) => item.symbol === marketSymbol.symbol);
      
      if (!quote) {
        return {
          symbol: marketSymbol.symbol,
          name: marketSymbol.displayName || marketSymbol.name,
          price: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date(),
          error: true
        };
      }
      
      return {
        symbol: marketSymbol.symbol,
        name: marketSymbol.displayName || marketSymbol.name,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        lastUpdated: new Date()
      };
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    toast.error("Failed to fetch live market data. Using fallback values.");
    
    // Return the fallback data with error flag
    return marketSymbols.map(marketSymbol => ({
      symbol: marketSymbol.symbol,
      name: marketSymbol.displayName || marketSymbol.name,
      price: 0,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date(),
      error: true
    }));
  }
};

// This is a fallback function that creates mock data when APIs fail
export const generateFallbackData = (): MarketData[] => {
  const mockData: MarketData[] = [];
  const now = new Date();
  
  // Base values for different asset types (realistic values as of April 2025)
  const baseValues = {
    "^NSEI": 25380.42,
    "^BSESN": 83412.47,
    "^NSEBANK": 48290.00,
    "^IXIC": 17825.35,
    "^GSPC": 5650.80,
    "^DJI": 42300.95,
    "^N225": 41250.30,
    "^HSI": 18750.20,
    "INR=X": 83.25,
    "EURUSD=X": 1.0825,
    "JPYINR=X": 0.5430,
    "GC=F": 2480.50,
    "SI=F": 32.80,
    "BZ=F": 82.45,
    "BTC-USD": 92500.00,
    "ETH-USD": 5850.00,
  };
  
  marketSymbols.forEach(sym => {
    // Generate random changes within realistic ranges
    const baseValue = baseValues[sym.symbol as keyof typeof baseValues] || 1000;
    const changePercent = (Math.random() * 2 - 1) * (sym.type === "crypto" ? 3 : 1.5);
    const change = baseValue * (changePercent / 100);
    const price = baseValue + change;
    
    mockData.push({
      symbol: sym.symbol,
      name: sym.displayName || sym.name,
      price,
      change,
      changePercent,
      lastUpdated: now
    });
  });
  
  return mockData;
};

// Function to find the appropriate MarketSymbol for a given symbol string
export const getSymbolDetails = (symbol: string): MarketSymbol | undefined => {
  return marketSymbols.find(s => s.symbol === symbol);
};
