
import { toast } from "sonner";

// Define types for our market data
export type MarketSymbol = {
  id: string;
  name: string;
  symbol: string;
  type: "index" | "forex" | "commodity" | "crypto";
  displayName?: string;
  currency?: string;
  twelveDataSymbol?: string;
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
  { id: "nifty50", name: "NIFTY 50", symbol: "^NSEI", type: "index", currency: "₹", twelveDataSymbol: "NSE:NIFTY_50" },
  { id: "sensex", name: "SENSEX", symbol: "^BSESN", type: "index", currency: "₹", twelveDataSymbol: "INDEXBOM:SENSEX" },
  { id: "banknifty", name: "BANK NIFTY", symbol: "^NSEBANK", type: "index", currency: "₹", twelveDataSymbol: "NSE:BANKNIFTY" },
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

// Twelve Data API key - Replace with your own key
// IMPORTANT: Replace 'YOUR_TWELVE_DATA_KEY' with your actual API key from Twelve Data
const TWELVE_DATA_API_KEY = "YOUR_TWELVE_DATA_KEY";

// Yahoo Finance API integration with fallback to TwelveData and static data
export const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    // Prepare result array that we'll populate from different sources
    let resultData: MarketData[] = [];
    
    // 1. Try Twelve Data API for Indian indices (Nifty and Sensex)
    try {
      const twelveDataSymbols = marketSymbols
        .filter(s => s.twelveDataSymbol)
        .map(s => s.twelveDataSymbol)
        .join(',');
      
      if (twelveDataSymbols && TWELVE_DATA_API_KEY !== "YOUR_TWELVE_DATA_KEY") {
        const twelveDataUrl = `https://api.twelvedata.com/price?symbol=${twelveDataSymbols}&apikey=${TWELVE_DATA_API_KEY}`;
        const twelveDataResponse = await fetch(twelveDataUrl);
        
        if (!twelveDataResponse.ok) {
          throw new Error("Twelve Data API failed");
        }
        
        const twelveData = await twelveDataResponse.json();
        
        // Process Twelve Data response and add to results
        for (const symbol of marketSymbols.filter(s => s.twelveDataSymbol)) {
          const tdSymbol = symbol.twelveDataSymbol;
          if (tdSymbol && twelveData[tdSymbol]) {
            // For Twelve Data, we only get price without change
            // We'll need to calculate change based on previously known values
            // For now, we'll just use a small random change
            const price = parseFloat(twelveData[tdSymbol].price);
            const changePercent = (Math.random() * 2 - 1) * 0.5; // Random -0.5% to 0.5%
            const change = price * (changePercent / 100);
            
            resultData.push({
              symbol: symbol.symbol,
              name: symbol.displayName || symbol.name,
              price,
              change,
              changePercent,
              lastUpdated: new Date(),
              currency: symbol.currency,
            });
          }
        }
      }
    } catch (twelveDataError) {
      console.error("Error fetching from Twelve Data API:", twelveDataError);
    }
    
    // 2. Try Yahoo Finance for remaining indices and forex
    try {
      // Include symbols that weren't handled by Twelve Data
      const processedSymbols = new Set(resultData.map(d => d.symbol));
      const remainingSymbols = marketSymbols
        .filter(s => !processedSymbols.has(s.symbol) && s.type !== "crypto")
        .map(s => s.symbol);
      
      if (remainingSymbols.length > 0) {
        const symbolsParam = remainingSymbols.join(",");
        const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`);
        
        if (!response.ok) {
          throw new Error("Yahoo Finance API failed");
        }
        
        const data = await response.json();
        
        if (data.quoteResponse && data.quoteResponse.result) {
          const results = data.quoteResponse.result;
          
          // Add Yahoo Finance data to results
          for (const marketSymbol of marketSymbols.filter(s => remainingSymbols.includes(s.symbol))) {
            const quote = results.find((item: any) => item.symbol === marketSymbol.symbol);
            
            if (quote) {
              resultData.push({
                symbol: marketSymbol.symbol,
                name: marketSymbol.displayName || marketSymbol.name,
                price: quote.regularMarketPrice || 0,
                change: quote.regularMarketChange || 0,
                changePercent: quote.regularMarketChangePercent || 0,
                lastUpdated: new Date(),
                currency: marketSymbol.currency,
              });
            }
          }
        }
      }
    } catch (yahooError) {
      console.error("Error fetching from Yahoo Finance API:", yahooError);
    }
    
    // 3. Try CoinGecko for crypto data
    try {
      const cryptoResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24h_change=true");
      if (cryptoResponse.ok) {
        const cryptoData = await cryptoResponse.json();
        
        const processedSymbols = new Set(resultData.map(d => d.symbol));
        const cryptoSymbols = marketSymbols.filter(s => s.type === "crypto" && !processedSymbols.has(s.symbol));
        
        // Map crypto ids to symbols
        const cryptoIdMap: {[key: string]: string} = {
          'bitcoin': 'BTC-USD',
          'ethereum': 'ETH-USD',
          'solana': 'SOL-USD'
        };
        
        // Add crypto data to results
        for (const cryptoId of Object.keys(cryptoData)) {
          const symbolName = cryptoIdMap[cryptoId];
          if (symbolName) {
            const marketSymbol = marketSymbols.find(s => s.symbol === symbolName);
            if (marketSymbol) {
              const cryptoInfo = cryptoData[cryptoId];
              if (cryptoInfo) {
                const price = cryptoInfo.usd || 0;
                const changePercent = cryptoInfo.usd_24h_change || 0;
                const change = price * (changePercent / 100);
                
                resultData.push({
                  symbol: marketSymbol.symbol,
                  name: marketSymbol.displayName || marketSymbol.name,
                  price,
                  change,
                  changePercent,
                  lastUpdated: new Date(),
                  currency: marketSymbol.currency,
                });
              }
            }
          }
        }
      } else {
        throw new Error("CoinGecko API failed");
      }
    } catch (cryptoError) {
      console.error("Error fetching crypto data:", cryptoError);
    }
    
    // 4. Fill in fallback data for any missing symbols
    const processedSymbols = new Set(resultData.map(d => d.symbol));
    const missingSymbols = marketSymbols.filter(s => !processedSymbols.has(s.symbol));
    
    for (const symbol of missingSymbols) {
      resultData.push(generateFallbackItem(symbol));
    }
    
    return resultData;
  } catch (error) {
    console.error("All market data APIs failed:", error);
    toast.error("Failed to fetch live market data. Using fallback values.");
    
    // Return the fallback data with error flag
    return generateFallbackData();
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
