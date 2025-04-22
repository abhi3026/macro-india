import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import NewsletterModal from "@/components/NewsletterModal";
import Markets from "@/components/Markets";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingViewChart from "@/components/TradingViewChart";
import AdSpace from "@/components/AdSpace";
import TradingViewNewsWidget from "@/components/TradingViewNewsWidget";
import SEOHead from "@/components/SEOHead";
import FeaturedResearch from "@/components/FeaturedResearch";
import EducationalResources from "@/components/EducationalResources";
import WhatWeOffer from "@/components/WhatWeOffer";
import InterestRateTracker from "@/components/InterestRateTracker";

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    // Show newsletter modal after 30 seconds
    const timer = setTimeout(() => {
      setShowNewsletter(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="IndianMacro | Indian Economic Data & Financial Markets"
        description="Real-time Indian economic data, financial markets, and macroeconomic indicators. Track GDP, inflation, interest rates, and more."
      />
      <Navbar />
      <MarketTickerLive />
      
      <main className="flex-1 pt-4 pb-8 overflow-x-hidden">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Column - 8/12 width */}
            <div className="lg:col-span-8 space-y-6">
              {/* TradingView Chart Section */}
              <div className="bg-white rounded-lg shadow-sm will-change-transform">
                <TradingViewChart />
              </div>

              {/* Markets Section */}
              <div className="will-change-transform">
                <Markets />
              </div>

              {/* Economic Indicators Section */}
              <div className="will-change-transform">
                <EconomicIndicatorsDashboard />
              </div>

              {/* Featured Research Section */}
              <div className="will-change-transform">
                <FeaturedResearch />
              </div>

              {/* Educational Resources Section */}
              <div className="will-change-transform">
                <EducationalResources />
              </div>

              {/* What We Offer Section */}
              <div className="will-change-transform">
                <WhatWeOffer />
              </div>
            </div>

            {/* Right Sidebar - 4/12 width */}
            <aside className="lg:col-span-4 space-y-6">
              {/* News Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 will-change-transform overflow-hidden min-w-[350px]">
                <div className="overflow-x-hidden">
                  <TradingViewNewsWidget />
                </div>
              </div>

              {/* Ad Section */}
              <div className="bg-white rounded-lg shadow-sm will-change-transform overflow-hidden">
                <AdSpace />
              </div>

              {/* Economic Calendar Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 will-change-transform overflow-hidden min-w-[350px]">
                <div className="overflow-x-hidden">
                  <EconomicCalendar />
                </div>
              </div>

              {/* Interest Rates & Bonds Tracker */}
              <div className="bg-white rounded-lg shadow-sm p-4 will-change-transform overflow-hidden min-w-[350px]">
                <div className="overflow-x-hidden">
                  <InterestRateTracker />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
      {showNewsletter && (
        <NewsletterModal onClose={() => setShowNewsletter(false)} />
      )}
    </div>
  );
};

export default HomePage;
