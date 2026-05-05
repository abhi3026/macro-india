import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterModal from "@/components/NewsletterModal";
import HeroSection from "@/components/HeroSection";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import FeaturedResearch from "@/components/FeaturedResearch";
import EducationalResources from "@/components/EducationalResources";
import WhatWeOffer from "@/components/WhatWeOffer";
import InterestRateTracker from "@/components/InterestRateTracker";

const TradingViewNewsWidget = lazy(() => import("@/components/TradingViewNewsWidget"));

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Smarter newsletter trigger: exit-intent + 50% scroll, once per user
  useEffect(() => {
    if (localStorage.getItem("newsletter-subscribed") === "true") return;
    if (sessionStorage.getItem("newsletter-shown") === "true") return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem("newsletter-shown", "true");
      setShowNewsletter(true);
    };

    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      if (scrolled / document.documentElement.scrollHeight > 0.55) trigger();
    };
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
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

      <Navbar />

      <main>
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <EconomicIndicatorsDashboard />
              <InterestRateTracker />
            </div>
            <div className="space-y-8">
              <EconomicCalendar />
              <Suspense fallback={<div className="surface h-[460px] animate-pulse" aria-hidden />}>
                <TradingViewNewsWidget />
              </Suspense>
            </div>
          </div>

          <div className="mt-16 space-y-16">
            <FeaturedResearch />
            <EducationalResources />
            <WhatWeOffer />
          </div>
        </div>
      </main>

      <Footer />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </div>
  );
};

export default HomePage;
