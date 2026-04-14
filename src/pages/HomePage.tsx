
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
import StructuredData from "@/components/StructuredData";
import FeaturedResearch from "@/components/FeaturedResearch";
import EducationalResources from "@/components/EducationalResources";
import WhatWeOffer from "@/components/WhatWeOffer";
import InterestRateTracker from "@/components/InterestRateTracker";

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const hasSubscribed = localStorage.getItem("newsletter-subscribed") === "true";
      if (!hasSubscribed) {
        setShowNewsletter(true);
      }
    }, 5000);
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
        title="IndianMacro | Indian Economic Data, Markets & Research"
        description="Track Indian economic indicators, live market data, GDP, inflation, interest rates, and financial research. Your comprehensive source for India's macroeconomic insights."
        canonicalUrl="/"
        keywords="Indian economy, GDP India, inflation India, Nifty 50, Sensex, RBI policy, economic indicators, market data, financial research India"
      />
      <StructuredData type="Organization" />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: 'Home', url: '/' },
        ]}
      />
      
      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>
      
      <div className="pt-0 mt-0">
        <MarketTickerLive />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TradingViewChart defaultSymbol="NSE:NIFTY" />
            <Markets />
            <EconomicIndicatorsDashboard />
          </div>
          <div className="space-y-8">
            <EconomicCalendar />
            <TradingViewNewsWidget />
            <InterestRateTracker />
          </div>
        </div>
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
