
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const InterestRatesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Interest Rates & Bond Yields India | IndianMacro"
        description="Track RBI repo rate, reverse repo rate, 10-year G-Sec yields, and global central bank interest rates. Monitor India's bond market and monetary policy trends."
        canonicalUrl="/data-dashboard/interest-rates-bonds"
        keywords="RBI repo rate, India interest rates, 10 year government bond yield India, central bank rates, bond market India"
      />
      <StructuredData
        type="Dataset"
        name="Interest Rates & Bond Yields"
        description="Central bank interest rates, government bond yields, and monetary policy data for India and global economies."
        url="/data-dashboard/interest-rates-bonds"
        keywords={["interest rates", "bond yields", "RBI repo rate", "G-Sec yield", "monetary policy"]}
        spatialCoverage="Global"
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: 'Home', url: '/' },
          { name: 'Data Dashboard', url: '/data-dashboard' },
          { name: 'Interest Rates & Bonds', url: '/data-dashboard/interest-rates-bonds' },
        ]}
      />
      
      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Interest Rates & Bonds"
        description="Track interest rates, bond yields, and central bank policies"
      />
      
      <main className="flex-1 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Interest Rates & Bond Market Data</h1>
          <p className="text-muted-foreground mb-8">Monitor RBI policy rates, government bond yields, and compare central bank rates across major economies.</p>
          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                We are working on bringing you comprehensive interest rates and bond market data.
                Check back soon for updates.
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterestRatesPage;
