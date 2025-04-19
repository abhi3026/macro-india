
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import NewsletterModal from "@/components/NewsletterModal";
import Markets from "@/components/Markets";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import InvestingChart from "@/components/InvestingChart";
import AdSpace from "@/components/AdSpace";
import NewsSnippets from "@/components/NewsSnippets";
import SEOHead from "@/components/SEOHead";

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="IndianMacro | India's Macroeconomic Data & Research Platform"
        description="In-depth research, data analysis, and expert insights on Indian economy, markets, and financial trends."
        canonicalUrl="/"
      />
      
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>
      
      <div className="border-b border-border">
        <MarketTickerLive />
      </div>
      
      <main className="flex-grow">
        {/* Chart and News Section */}
        <section className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <InvestingChart />
              </div>
              <div className="lg:col-span-1">
                <NewsSnippets />
              </div>
            </div>
          </div>
        </section>
        
        {/* Markets and Ad Section */}
        <section className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <Markets />
              </div>
              <div className="lg:col-span-1">
                <AdSpace />
              </div>
            </div>
          </div>
        </section>
        
        {/* Economic Indicators and Calendar Section */}
        <section className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <EconomicIndicatorsDashboard />
              </div>
              <div className="lg:col-span-1">
                <EconomicCalendar />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <NewsletterModal />
    </div>
  );
};

export default HomePage;
