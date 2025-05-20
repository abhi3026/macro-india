
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import MarketTickerLive from "@/components/MarketTickerLive";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | Indian Macro</title>
        <meta 
          name="description" 
          content="Privacy policy detailing how Indian Macro handles and protects your personal information." 
        />
        <meta 
          name="keywords" 
          content="privacy policy, data protection, Indian Macro, user privacy, personal information" 
        />
      </Helmet>
      
      <header>
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Privacy Policy" 
        description="How we handle and protect your personal information" 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Privacy Policy</h2>
          <p>Last updated: May 1, 2023</p>
          
          <h3>1. Introduction</h3>
          <p>At Indian Macro, we respect your privacy and are committed to protecting your personal data.</p>
          
          <h3>2. Information We Collect</h3>
          <p>We may collect personal identification information from users in various ways, including when users visit our site, register, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available.</p>
          
          <h3>3. How We Use Your Information</h3>
          <p>We may use the information we collect from you to personalize your experience, improve our website, send periodic emails, and optimize the user experience.</p>
          
          <h3>4. How We Protect Your Information</h3>
          <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.</p>
          
          <h3>5. Sharing Your Personal Information</h3>
          <p>We do not sell, trade, or rent users' personal identification information to others.</p>
          
          <h3>6. Cookies</h3>
          <p>Our website may use "cookies" to enhance the user experience.</p>
          
          <h3>7. Changes to This Privacy Policy</h3>
          <p>Indian Macro has the discretion to update this privacy policy at any time. We encourage users to frequently check this page for any changes.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
