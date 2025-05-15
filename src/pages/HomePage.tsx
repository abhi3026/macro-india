
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
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Show newsletter modal after 5 seconds
    const timer = setTimeout(() => {
      setShowNewsletter(true);
    }, 5000);

    // Load widgets after a short delay to prevent race conditions
    const widgetTimer = setTimeout(() => {
      setWidgetsLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(widgetTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="IndianMacro | Indian Economic Data & Financial Markets"
        description="Access comprehensive Indian economic data, financial market analysis, and research. Track markets, economic indicators, and stay informed with IndianMacro."
      />
      
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <div className="pt-0 mt-0">
        <MarketTickerLive />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TradingViewChart defaultSymbol="NYSE:SPGI" />
            <EconomicIndicatorsDashboard />
            <Markets />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <EconomicCalendar />
            <TradingViewNewsWidget />
            <InterestRateTracker />
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-12 space-y-12">
          <FeaturedResearch />
          <EducationalResources />
          <WhatWeOffer />
        </div>
      </main>

      <Footer />
      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />
    </div>
  );
};

export default HomePage;
