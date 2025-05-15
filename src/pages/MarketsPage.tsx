import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Helmet } from "react-helmet-async";
import { MarketTable, MarketData } from "@/components/ui/market-table";
import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/ui/page-hero";

// TradingView Crypto Screener widget
const CryptoWidget = () => {
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
      colorTheme: "light",
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
  }, []);

  return (
    <div id="crypto-widget-container" className="w-full h-[550px]"></div>
  );
};

// Forex widget with light theme
const ForexWidget = () => {
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
      colorTheme: "light", // Changed to light theme
      locale: "en",
      backgroundColor: "#ffffff" // Light background color
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
  }, []);

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
    // Add more indices...
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
    // Add more stocks...
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
    // Add more commodities...
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
      flag: "/flags/eu.svg",
      symbol: "EUR/INR", 
      name: "Euro", 
      lastPrice: 89.8765, 
      changePercent: 0.26 
    },
    // Add more forex pairs...
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Markets | Macro India</title>
        <meta
          name="description"
          content="Track Indian financial markets including stocks, bonds, commodities, and forex."
        />
      </Helmet>
      
      <Navbar />
      <MarketTickerLive />
      
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
                <MarketTable data={indices} />
              </TabsContent>
              
              <TabsContent value="stocks" className="mt-0">
                <MarketTable data={stocks} showVolume />
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-0">
                {/* Replace market table with TradingView widget */}
                <CryptoWidget />
              </TabsContent>
              
              <TabsContent value="commodities" className="mt-0">
                <MarketTable data={commodities} />
              </TabsContent>
              
              <TabsContent value="forex" className="mt-0"> {/* Renamed from "currencies" */}
                <div className="space-y-6">
                  {/* Remove search bar and market table, keep only the widget */}
                  <ForexWidget />
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
