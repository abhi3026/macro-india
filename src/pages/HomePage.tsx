import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterModal from "@/components/NewsletterModal";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import MacroSummary from "@/components/MacroSummary";
import InsightLayer from "@/components/InsightLayer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

// Below-the-fold: code-split for faster LCP
const EconomicIndicatorsDashboard = lazy(() => import("@/components/EconomicIndicatorsDashboard"));
const InterestRateTracker = lazy(() => import("@/components/InterestRateTracker"));
const EconomicCalendar = lazy(() => import("@/components/EconomicCalendar"));
const FeaturedResearch = lazy(() => import("@/components/FeaturedResearch"));
const EducationalResources = lazy(() => import("@/components/EducationalResources"));
const WhatWeOffer = lazy(() => import("@/components/WhatWeOffer"));
const TradingViewNewsWidget = lazy(() => import("@/components/TradingViewNewsWidget"));

const Skeleton = ({ h = 320 }: { h?: number }) => (
  <div className="rounded-lg border bg-card animate-pulse" style={{ height: h }} aria-hidden />
);

const HomePage = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

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
        <MacroSummary />
        <InsightLayer />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Suspense fallback={<Skeleton h={420} />}>
                <EconomicIndicatorsDashboard />
              </Suspense>
              <Suspense fallback={<Skeleton h={360} />}>
                <InterestRateTracker />
              </Suspense>
            </div>
            <div className="space-y-8">
              <Suspense fallback={<Skeleton h={360} />}>
                <EconomicCalendar />
              </Suspense>
              <Suspense fallback={<Skeleton h={460} />}>
                <TradingViewNewsWidget />
              </Suspense>
            </div>
          </div>

          <div className="mt-16 space-y-16">
            <Suspense fallback={<Skeleton h={320} />}>
              <FeaturedResearch />
            </Suspense>
            <Suspense fallback={<Skeleton h={320} />}>
              <EducationalResources />
            </Suspense>
            <Suspense fallback={<Skeleton h={280} />}>
              <WhatWeOffer />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </div>
  );
};

export default HomePage;
