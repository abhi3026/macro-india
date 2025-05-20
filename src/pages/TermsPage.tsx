
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import MarketTickerLive from "@/components/MarketTickerLive";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service | Indian Macro</title>
        <meta 
          name="description" 
          content="Terms and conditions for using the Indian Macro platform and services." 
        />
        <meta 
          name="keywords" 
          content="terms of service, Indian Macro, legal, conditions, agreement" 
        />
      </Helmet>
      
      <header>
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Terms of Service" 
        description="Terms and conditions for using the Indian Macro platform" 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Terms of Service</h2>
          <p>Last updated: May 1, 2023</p>
          
          <h3>1. Introduction</h3>
          <p>Welcome to Indian Macro. By using our website, you agree to comply with and be bound by the following terms and conditions of use.</p>
          
          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily access the materials on Indian Macro's website for personal, non-commercial use only.</p>
          
          <h3>3. Disclaimer</h3>
          <p>The materials on Indian Macro's website are provided on an 'as is' basis. Indian Macro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
          
          <h3>4. Limitations</h3>
          <p>In no event shall Indian Macro be liable for any damages arising out of the use or inability to use the materials on Indian Macro's website.</p>
          
          <h3>5. Revisions</h3>
          <p>Indian Macro may revise these terms of use at any time without notice.</p>
          
          <h3>6. Governing Law</h3>
          <p>These terms shall be governed by and construed in accordance with the laws of India.</p>
          
          <h3>7. Data and Research</h3>
          <p>The data and research provided on this platform are for informational purposes only and should not be considered as financial advice.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsPage;
