import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterModal from "@/components/NewsletterModal";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingViewNewsWidget from "@/components/TradingViewNewsWidget";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import FeaturedResearch from "@/components/FeaturedResearch";
import EducationalResources from "@/components/EducationalResources";
import WhatWeOffer from "@/components/WhatWeOffer";
import InterestRateTracker from "@/components/InterestRateTracker";

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSubscribed = localStorage.getItem("newsletter-subscribed") === "true";
      if (!hasSubscribed) setShowNewsletter(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="IndianMacro | Indian Economic Data, Markets & Research"
        description="Track Indian economic indicators, GDP, inflation, interest rates, and financial research. Your comprehensive source for India's macroeconomic insights."
        canonicalUrl="/"
        keywords="Indian economy, GDP India, inflation India, RBI policy, economic indicators, financial research India"
      />
      <StructuredData type="Organization" />
      <StructuredData type="BreadcrumbList" items={[{ name: 'Home', url: '/' }]} />

      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EconomicIndicatorsDashboard />
            <InterestRateTracker />
          </div>
          <div className="space-y-8">
            <EconomicCalendar />
            <TradingViewNewsWidget />
          </div>
        </div>
        <div className="mt-12 space-y-12">
          <FeaturedResearch />
          <EducationalResources />
          <WhatWeOffer />
        </div>
      </main>

      <Footer />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </div>
  );
};

export default HomePage;
