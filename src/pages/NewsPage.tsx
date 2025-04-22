import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TradingViewTimeline from "@/components/TradingViewTimeline";

export default function NewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title="Market Timeline | IndianMacro"
        description="Track all markets and stay updated with the latest market movements and trends."
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Market Timeline</h1>
            <p className="text-lg text-gray-600">
              Track all markets and stay updated with the latest movements
            </p>
          </div>

          <div className="flex justify-center">
            <TradingViewTimeline />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 