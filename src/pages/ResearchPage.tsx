
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import MarketTickerLive from "@/components/MarketTickerLive";
import ResearchCMS from "@/components/ResearchCMS";

const ResearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Research | Indian Macro</title>
        <meta 
          name="description" 
          content="Explore data-backed research on India's economy and markets." 
        />
        <meta 
          name="keywords" 
          content="research, Indian economy, macro insights, stock market analysis" 
        />
      </Helmet>
      
      <header>
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Research" 
        description="Explore data-backed research on India's economy and markets" 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <ResearchCMS />
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;
