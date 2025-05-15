
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import { updateMetaTags } from "@/utils/metaTags";

const ResearchPage = () => {
  useEffect(() => {
    updateMetaTags(
      "Research | IndianMacro",
      "Explore our latest research on Indian economy, financial markets, and macroeconomic trends.",
      "/research"
    );
    
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Research | IndianMacro"
        description="Explore our latest research on Indian economy, financial markets, and macroeconomic trends."
        canonicalUrl="/research"
      />
      
      <header className="sticky top-0 z-50 bg-[#000041] text-white">
        <Navbar />
      </header>
      
      <PageHero 
        title="Research" 
        description="Explore our latest research on Indian economy, financial markets, and macroeconomic trends."
      />
      
      <main className="flex-grow bg-white">
        {/* Content will go here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-6">Featured Research</h2>
          {/* Featured research content */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;
