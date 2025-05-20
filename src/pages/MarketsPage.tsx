
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import SEOHead from "@/components/SEOHead";
import { MarketTable, MarketData } from "@/components/ui/market-table";
import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/ui/page-hero";
import { useTheme } from "@/components/ThemeProvider";

// TradingView Crypto Screener widget
const CryptoWidget = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  useEffect(() => {
    // Create container for widget
    const container = document.getElementById('crypto-widget-container');
    if (!container) return;
    
    // Clear any existing widgets
    container.innerHTML = '';

    // Create widget script
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 550,
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: isDarkMode ? "dark" : "light",
      locale: "en"
    });

    // Create widget container and add script
    const widgetContainer = document.createElement('div');
    widgetContainer.className = "tradingview-widget-container";
    
    const widgetDiv = document.createElement('div');
    widgetDiv.className = "tradingview-widget-container__widget";
    
    const copyright = document.createElement('div');
    copyright.className = "tradingview-widget-copyright";
    
    const link = document.createElement('a');
    link.href = "https://www.tradingview.com/";
    link.rel = "noopener nofollow";
    link.target = "_blank";
    
    const span = document.createElement('span');
    span.className = "blue-text";
    span.textContent = "Track all markets on TradingView";
    
    link.appendChild(span);
    copyright.appendChild(link);
    
    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);
    
    container.appendChild(widgetContainer);

    // Clean up
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isDarkMode]);

  return (
    <div id="crypto-widget-container" className="w-full h-[550px]"></div>
  );
};

// Forex widget with theme support
const ForexWidget = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  useEffect(() => {
    // Create container for widget
    const container = document.getElementById('forex-widget-container');
    if (!container) return;
    
    // Clear any existing widgets
    container.innerHTML = '';

    // Create widget script
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 400,
      currencies: [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY",
        "INR"
      ],
      isTransparent: false,
      colorTheme: isDarkMode ? "dark" : "light",
      locale: "en",
      backgroundColor: isDarkMode ? "#2B2B43" : "#ffffff"
    });

    // Create widget container and add script
    const widgetContainer = document.createElement('div');
    widgetContainer.className = "tradingview-widget-container";
    
    const widgetDiv = document.createElement('div');
    widgetDiv.className = "tradingview-widget-container__widget";
    
    const copyright = document.createElement('div');
    copyright.className = "tradingview-widget-copyright";
    
    const link = document.createElement('a');
    link.href = "https://www.tradingview.com/";
    link.rel = "noopener nofollow";
    link.target = "_blank";
    
    const span = document.createElement('span');
    span.className = "blue-text";
    span.textContent = "Track all markets on TradingView";
    
    link.appendChild(span);
    copyright.appendChild(link);
    
    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);
    
    container.appendChild(widgetContainer);

    // Clean up
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isDarkMode]);

  return (
    <div id="forex-widget-container" className="w-full h-[400px]"></div>
  );
};

const MarketsPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return tab || "indices";
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const indices: MarketData[] = [
    { 
      flag: "/flags/in.svg",
      symbol: "NIFTY", 
      name: "Nifty 50", 
      lastPrice: 22147.50, 
      changePercent: 0.56 
    },
    { 
      flag: "/flags/in.svg",
      symbol: "BANKNIFTY", 
      name: "Bank Nifty", 
      lastPrice: 48590.35, 
      changePercent: 0.89 
    },
    { 
      flag: "/flags/in.svg",
      symbol: "SENSEX", 
      name: "Sensex", 
      lastPrice: 73058.24, 
      changePercent: 0.63 
    },
    { 
      flag: "/flags/us.svg",
      symbol: "S&P 500",
      name: "S&P 500",
      lastPrice: 5000.00,
      changePercent: 0.25
    },
    {
      flag: "/flags/uk.svg",
      symbol: "FTSE 100",
      name: "FTSE 100",
      lastPrice: 7800.00,
      changePercent: -0.10
    },
    {
      flag: "/flags/cn.svg",
      symbol: "SSE",
      name: "SSE Composite",
      lastPrice: 3074.95,
      changePercent: 0.24
    },
    {
      flag: "/flags/jp.svg",
      symbol: "N225",
      name: "Nikkei 225",
      lastPrice: 38467.24,
      changePercent: -0.35
    },
    {
      flag: "/flags/br.svg",
      symbol: "BVSP",
      name: "IBOVESPA",
      lastPrice: 124568.20,
      changePercent: 0.74
    },
    {
      flag: "/flags/de.svg",
      symbol: "DAX",
      name: "DAX",
      lastPrice: 17789.38,
      changePercent: -0.42
    },
    {
      flag: "/flags/fr.svg",
      symbol: "CAC40",
      name: "CAC 40",
      lastPrice: 7645.20,
      changePercent: -0.38
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
    },
    { 
      flag: "/flags/in.svg",
      symbol: "HDFCBANK", 
      name: "HDFC Bank", 
      lastPrice: 1500.00, 
      changePercent: 0.75,
      volume: 3456789
    },
    {
      flag: "/flags/in.svg",
      symbol: "INFOSYS",
      name: "Infosys",
      lastPrice: 1600.00,
      changePercent: 0.30,
      volume: 2345678
    },
    {
      flag: "/flags/in.svg",
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      lastPrice: 850.00,
      changePercent: 0.90,
      volume: 4567890
    },
    {
      flag: "/flags/in.svg",
      symbol: "SBIN",
      name: "State Bank of India",
      lastPrice: 625.75,
      changePercent: 1.25,
      volume: 3789456
    },
    {
      flag: "/flags/in.svg",
      symbol: "HINDUNILVR",
      name: "Hindustan Unilever",
      lastPrice: 2450.60,
      changePercent: -0.45,
      volume: 1234789
    },
    {
      flag: "/flags/in.svg",
      symbol: "BHARTIARTL",
      name: "Bharti Airtel",
      lastPrice: 1140.50,
      changePercent: 0.85,
      volume: 2345987
    },
    {
      flag: "/flags/in.svg",
      symbol: "WIPRO",
      name: "Wipro",
      lastPrice: 475.25,
      changePercent: -0.35,
      volume: 1678543
    },
    {
      flag: "/flags/in.svg",
      symbol: "LT",
      name: "Larsen & Toubro",
      lastPrice: 3245.80,
      changePercent: 1.05,
      volume: 987345
    }
  ];

  const commodities: MarketData[] = [
    { 
      symbol: "GOLD", 
      name: "Gold", 
      lastPrice: 2367.50, 
      changePercent: 1.85 
    },
    { 
      symbol: "SILVER", 
      name: "Silver", 
      lastPrice: 28.45, 
      changePercent: 1.59 
    },
    {
      symbol: "WTI Crude",
      name: "WTI Crude Oil",
      lastPrice: 80.00,
      changePercent: 0.50
    },
    {
      symbol: "Brent Crude",
      name: "Brent Crude Oil",
      lastPrice: 85.00,
      changePercent: 0.75
    }
  ];

  // Renamed from 'currencies' to 'forex'
  const forex: MarketData[] = [
    { 
      flag: "/flags/us.svg",
      symbol: "USD/INR", 
      name: "US Dollar", 
      lastPrice: 83.2456, 
      changePercent: -0.15 
    },
    { 
      flag: "/flags/gb.svg",
      symbol: "GBP/INR", 
      name: "British Pound", 
      lastPrice: 105.3456, 
      changePercent: 0.10 
    },
    { 
      flag: "/flags/eu.svg",
      symbol: "EUR/INR", 
      name: "Euro", 
      lastPrice: 89.8765, 
      changePercent: 0.26 
    },
    {
      flag: "/flags/jp.svg",
      symbol: "JPY/INR",
      name: "Japanese Yen",
      lastPrice: 0.5528,
      changePercent: -0.05
    },
    {
      flag: "/flags/au.svg",
      symbol: "AUD/INR",
      name: "Australian Dollar",
      lastPrice: 55.4280,
      changePercent: 0.20
    },
    {
      flag: "/flags/jp.svg",
      symbol: "USD/JPY",
      name: "US Dollar/Japanese Yen",
      lastPrice: 152.30,
      changePercent: 0.15
    },
    {
      flag: "/flags/eu.svg",
      symbol: "USD/EUR",
      name: "US Dollar/Euro",
      lastPrice: 0.93,
      changePercent: -0.10
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Markets | IndianMacro"
        description="Track Indian financial markets including stocks, bonds, commodities, and forex."
        canonicalUrl="/data-dashboard/markets"
      />
      
      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>
      
      <div className="pt-0 mt-0">
        <MarketTickerLive />
      </div>
      
      <PageHero 
        title="Markets" 
        description="Track Indian financial markets across asset classes"
      />
      
      <main className="flex-1 pt-4 pb-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6">
            <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger id="tab-indices" value="indices">Indices</TabsTrigger>
                <TabsTrigger id="tab-stocks" value="stocks">Stocks</TabsTrigger>
                <TabsTrigger id="tab-crypto" value="crypto">Crypto</TabsTrigger>
                <TabsTrigger id="tab-commodities" value="commodities">Commodities</TabsTrigger>
                <TabsTrigger id="tab-forex" value="forex">Forex</TabsTrigger> {/* Renamed from "Currencies" */}
              </TabsList>
              
              <TabsContent value="indices" className="mt-0">
                <div className="overflow-x-auto">
                  <MarketTable data={indices} />
                </div>
              </TabsContent>
              
              <TabsContent value="stocks" className="mt-0">
                <div className="overflow-x-auto">
                  <MarketTable data={stocks} showVolume />
                </div>
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-0">
                {/* Replace market table with TradingView widget */}
                <div className="overflow-hidden rounded-md">
                  <CryptoWidget />
                </div>
              </TabsContent>
              
              <TabsContent value="commodities" className="mt-0">
                <div className="overflow-x-auto">
                  <MarketTable data={commodities} />
                </div>
              </TabsContent>
              
              <TabsContent value="forex" className="mt-0"> {/* Renamed from "currencies" */}
                <div className="space-y-6">
                  {/* Remove search bar and market table, keep only the widget */}
                  <div className="overflow-hidden rounded-md">
                    <ForexWidget />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MarketsPage;
