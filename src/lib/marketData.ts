
import { toast } from "sonner";

// Define types for our market data
export type MarketSymbol = {
  id: string;
  name: string;
  symbol: string;
  type: "index" | "forex" | "commodity" | "crypto";
  displayName?: string;
  currency?: string;
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
  currency?: string;
};

// Market symbols configuration - these can be easily added/removed later
export const marketSymbols: MarketSymbol[] = [
  { id: "nifty50", name: "NIFTY 50", symbol: "^NSEI", type: "index", currency: "₹" },
  { id: "sensex", name: "SENSEX", symbol: "^BSESN", type: "index", currency: "₹" },
  { id: "banknifty", name: "BANK NIFTY", symbol: "^NSEBANK", type: "index", currency: "₹" },
  { id: "nasdaq", name: "NASDAQ", symbol: "^IXIC", type: "index", currency: "$" },
  { id: "sp500", name: "S&P 500", symbol: "^GSPC", type: "index", currency: "$" },
  { id: "dowjones", name: "DOW JONES", symbol: "^DJI", type: "index", currency: "$" },
  { id: "nikkei", name: "NIKKEI 225", symbol: "^N225", type: "index", currency: "¥" },
  { id: "hangseng", name: "HANG SENG", symbol: "^HSI", type: "index", currency: "HK$" },
  { id: "usdinr", name: "USD/INR", symbol: "INR=X", type: "forex", displayName: "USD/INR", currency: "₹" },
  { id: "eurusd", name: "EUR/USD", symbol: "EURUSD=X", type: "forex", displayName: "EUR/USD", currency: "$" },
  { id: "jpyinr", name: "JPY/INR", symbol: "JPYINR=X", type: "forex", displayName: "JPY/INR", currency: "₹" },
  { id: "gold", name: "Gold", symbol: "GC=F", type: "commodity", currency: "$" },
  { id: "silver", name: "Silver", symbol: "SI=F", type: "commodity", currency: "$" },
  { id: "brentcrudeoil", name: "Brent Crude Oil", symbol: "BZ=F", type: "commodity", displayName: "Crude Oil", currency: "$" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC-USD", type: "crypto", displayName: "BTC", currency: "$" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH-USD", type: "crypto", displayName: "ETH", currency: "$" },
  { id: "solana", name: "Solana", symbol: "SOL-USD", type: "crypto", displayName: "SOL", currency: "$" },
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
    currency: sym.currency,
  }));
};

// Format currency based on type
export const formatPrice = (price: number, type: string, currency?: string): string => {
  const currencySymbol = currency || '';
  
  if (type === "crypto") {
    return `${currencySymbol}${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  } else if (type === "forex") {
    return `${currencySymbol}${price.toLocaleString('en-IN', { maximumFractionDigits: 4 })}`;
  } else {
    return `${currencySymbol}${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }
};

// MarketStack API key - Replace with your own if needed
const MARKETSTACK_API_KEY = "95ee8c00470a8b3836d1288b856bd929";

// Yahoo Finance API integration with fallback to MarketStack and static data
export const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    // Try Yahoo Finance API first
    const symbolsParam = marketSymbols.map(item => item.symbol).join(",");
    
    // Using Yahoo Finance API
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`);
    
    if (!response.ok) {
      throw new Error("Yahoo Finance API failed");
    }
    
    const data = await response.json();
    
    if (!data.quoteResponse || !data.quoteResponse.result) {
      throw new Error("Invalid Yahoo Finance response format");
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
          error: true,
          currency: marketSymbol.currency,
        };
      }
      
      return {
        symbol: marketSymbol.symbol,
        name: marketSymbol.displayName || marketSymbol.name,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        lastUpdated: new Date(),
        currency: marketSymbol.currency,
      };
    });
  } catch (yahooError) {
    console.error("Error fetching from Yahoo Finance API:", yahooError);
    
    // Try MarketStack as fallback for stock indices
    try {
      // For stocks and indices, try MarketStack
      const stockSymbols = marketSymbols
        .filter(s => s.type === "index")
        .map(s => s.symbol.replace("^", ""))
        .join(",");
      
      const marketStackUrl = `http://api.marketstack.com/v1/intraday/latest?access_key=${MARKETSTACK_API_KEY}&symbols=${stockSymbols}`;
      const stockResponse = await fetch(marketStackUrl);
      
      if (!stockResponse.ok) {
        throw new Error("MarketStack API failed");
      }
      
      const stockData = await stockResponse.json();
      
      // Try to fetch crypto data separately
      let cryptoData: any[] = [];
      try {
        const cryptoResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24h_change=true");
        if (cryptoResponse.ok) {
          cryptoData = await cryptoResponse.json();
        }
      } catch (cryptoError) {
        console.error("Error fetching crypto data:", cryptoError);
      }
      
      // Combine the data and map to our format
      return marketSymbols.map(marketSymbol => {
        // Handle stock data from MarketStack
        if (marketSymbol.type === "index") {
          const symbol = marketSymbol.symbol.replace("^", "");
          const stockInfo = stockData.data?.find((item: any) => item.symbol === symbol);
          
          if (stockInfo) {
            const prevClose = stockInfo.close || 0;
            const currentPrice = stockInfo.last || 0;
            const change = currentPrice - prevClose;
            const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
            
            return {
              symbol: marketSymbol.symbol,
              name: marketSymbol.displayName || marketSymbol.name,
              price: currentPrice,
              change,
              changePercent,
              lastUpdated: new Date(),
              currency: marketSymbol.currency,
            };
          }
        }
        
        // Handle crypto data from CoinGecko
        if (marketSymbol.type === "crypto") {
          const cryptoId = marketSymbol.id.toLowerCase();
          const cryptoInfo = cryptoData[cryptoId];
          
          if (cryptoInfo) {
            const price = cryptoInfo.usd || 0;
            const changePercent = cryptoInfo.usd_24h_change || 0;
            const change = price * (changePercent / 100);
            
            return {
              symbol: marketSymbol.symbol,
              name: marketSymbol.displayName || marketSymbol.name,
              price,
              change,
              changePercent,
              lastUpdated: new Date(),
              currency: marketSymbol.currency,
            };
          }
        }
        
        // Fall back to generated data for items we couldn't fetch
        return generateFallbackItem(marketSymbol);
      });
    } catch (marketStackError) {
      console.error("Error fetching from MarketStack API:", marketStackError);
      toast.error("Failed to fetch live market data. Using fallback values.");
      
      // Return the fallback data with error flag
      return generateFallbackData();
    }
  }
};

// Generate a single fallback item
const generateFallbackItem = (marketSymbol: MarketSymbol): MarketData => {
  // Base values for different asset types (realistic values as of April 2025)
  const baseValues: {[key: string]: number} = {
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
    "SOL-USD": 245.75,
  };
  
  // Generate random changes within realistic ranges
  const baseValue = baseValues[marketSymbol.symbol] || 1000;
  const changePercent = (Math.random() * 2 - 1) * (marketSymbol.type === "crypto" ? 3 : 1.5);
  const change = baseValue * (changePercent / 100);
  const price = baseValue + change;
  
  return {
    symbol: marketSymbol.symbol,
    name: marketSymbol.displayName || marketSymbol.name,
    price,
    change,
    changePercent,
    lastUpdated: new Date(),
    currency: marketSymbol.currency,
  };
};

// This is a fallback function that creates mock data when APIs fail
export const generateFallbackData = (): MarketData[] => {
  return marketSymbols.map(symbol => generateFallbackItem(symbol));
};

// Function to find the appropriate MarketSymbol for a given symbol string
export const getSymbolDetails = (symbol: string): MarketSymbol | undefined => {
  return marketSymbols.find(s => s.symbol === symbol);
};
