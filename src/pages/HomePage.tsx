
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import NewsletterModal from "@/components/NewsletterModal";
import Markets from "@/components/Markets";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingViewChart from "@/components/TradingViewChart";
import TradingViewNewsWidget from "@/components/TradingViewNewsWidget";
import SEOHead from "@/components/SEOHead";
import FeaturedResearch from "@/components/FeaturedResearch";
import EducationalResources from "@/components/EducationalResources";
import WhatWeOffer from "@/components/WhatWeOffer";
import InterestRateTracker from "@/components/InterestRateTracker";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Show newsletter modal after 5 seconds
    const timer = setTimeout(() => {
      // Only show if user hasn't subscribed before
      const hasSubscribed = localStorage.getItem("newsletter-subscribed") === "true";
      if (!hasSubscribed) {
        setShowNewsletter(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="IndianMacro | Indian Economic Data & Financial Markets"
        description="Access comprehensive Indian economic data, financial market analysis, and research. Track markets, economic indicators, and stay informed with IndianMacro."
        canonicalUrl="/"
      />
      
      <header>
        <Navbar />
      </header>
      
      <TradingViewTickerTape />
      <MarketTickerLive />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TradingViewChart defaultSymbol="NYSE:SPGI" />
            {/* Markets moved above Economic Indicators as requested */}
            <Markets />
            <EconomicIndicatorsDashboard />
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
