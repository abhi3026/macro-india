
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import { updateMetaTags } from "@/utils/metaTags";
import MarketTickerLive from "@/components/MarketTickerLive";

const ResearchPage = () => {
  useEffect(() => {
    updateMetaTags(
      "Research | IndianMacro",
      "Explore our latest research on Indian economy, financial markets, and macroeconomic trends.",
      "/research",
      undefined,
      "article"
    );
    
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Research | IndianMacro"
        description="Explore our latest research on Indian economy, financial markets, and macroeconomic trends."
        canonicalUrl="/research"
        ogType="article"
      />
      
      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>
      
      <div className="pt-0 mt-0">
        <MarketTickerLive />
      </div>
      
      <PageHero 
        title="Research" 
        description="Explore our latest research on Indian economy, financial markets, and macroeconomic trends."
      />
      
      <main className="flex-grow bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-6">Featured Research</h2>
          {/* Featured research content will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for research content */}
            <div className="border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2">India's Economic Outlook 2023-24</h3>
              <p className="text-muted-foreground mb-4">Analysis of key economic indicators and future projections for the Indian economy.</p>
              <p className="text-sm text-accent1">Read more →</p>
            </div>
            <div className="border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2">The Impact of Global Inflation</h3>
              <p className="text-muted-foreground mb-4">How global inflation trends are affecting India's monetary policy and economy.</p>
              <p className="text-sm text-accent1">Read more →</p>
            </div>
            <div className="border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2">Banking Sector Analysis</h3>
              <p className="text-muted-foreground mb-4">In-depth examination of Indian banking sector performance and challenges.</p>
              <p className="text-sm text-accent1">Read more →</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;
