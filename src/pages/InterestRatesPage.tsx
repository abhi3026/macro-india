
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import PageHero from "@/components/ui/page-hero";

const InterestRatesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Interest Rates & Bonds | Macro India</title>
        <meta
          name="description"
          content="Track interest rates, bond yields, and central bank policies."
        />
      </Helmet>
      
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
