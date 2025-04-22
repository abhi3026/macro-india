import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Helmet } from "react-helmet-async";
import { MarketTable, MarketData } from "@/components/ui/market-table";
import { useSearchParams } from "react-router-dom";

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
    },
    // Add more crypto...
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

  const currencies: MarketData[] = [
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
    // Add more currencies...
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
      
      <main className="flex-1 pt-4 pb-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Markets</h1>
            <p className="text-muted-foreground">
              Monitor Indian financial markets across asset classes
            </p>
          </section>

          <Card className="p-6">
            <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger id="tab-indices" value="indices">Indices</TabsTrigger>
                <TabsTrigger id="tab-stocks" value="stocks">Stocks</TabsTrigger>
                <TabsTrigger id="tab-crypto" value="crypto">Crypto</TabsTrigger>
                <TabsTrigger id="tab-commodities" value="commodities">Commodities</TabsTrigger>
                <TabsTrigger id="tab-currencies" value="currencies">Currencies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="indices" className="mt-0">
                <MarketTable data={indices} />
              </TabsContent>
              
              <TabsContent value="stocks" className="mt-0">
                <MarketTable data={stocks} showVolume />
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-0">
                <MarketTable data={crypto} showVolume />
              </TabsContent>
              
              <TabsContent value="commodities" className="mt-0">
                <MarketTable data={commodities} />
              </TabsContent>
              
              <TabsContent value="currencies" className="mt-0">
                <MarketTable data={currencies} />
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