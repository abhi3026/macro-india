
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";
import { BarChart2, LineChart, BookOpen, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";

const AboutPage = () => {
  useEffect(() => {
    updateMetaTags(
      "About Us | IndianMacro",
      "Learn about IndianMacro's mission to provide comprehensive macroeconomic data and research for India and global markets.",
      "/about"
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="About Us | IndianMacro"
        description="Learn about IndianMacro's mission to provide comprehensive macroeconomic data and research for India and global markets."
        canonicalUrl="/about"
      />
      
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <Navbar />
      </header>
      
      <PageHeader 
        title="About Us | Indian Macro" 
        description="Welcome to Indian Macro — Your Gateway to India's Financial Insights."
      />
      
      {/* Mission Section */}
      <div className="bg-white dark:bg-indianmacro-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-indianmacro-600 dark:text-indianmacro-300">
              At Indian Macro, we are passionate about decoding the complex world of finance, investments, and macroeconomics, with a special focus on India.
              Our mission is simple: make high-quality financial research accessible and actionable for investors, students, and professionals alike.
            </p>
          </div>
        </div>
      </div>
      
      {/* What We Do Section */}
      <div className="bg-indianmacro-50 dark:bg-indianmacro-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-12 text-center">What We Do</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <LineChart className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Financial Research</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  We deliver in-depth analysis on India's economic trends, sectors, stocks, ETFs, and cryptocurrencies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <BarChart2 className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Live Market Data</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  Stay updated with real-time stock market and crypto prices, powered by trusted APIs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <Globe className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Macro Insights</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  From monetary policy to fiscal developments, we provide timely coverage of key economic indicators shaping India's growth story.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <BookOpen className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Educational Content</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  We aim to build financial literacy by explaining complex topics in an easy-to-understand way through blogs, reports, and newsletters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Why Indian Macro Section */}
      <div className="bg-white dark:bg-indianmacro-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-12 text-center">Why Indian Macro?</h2>
          
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent1 text-white flex items-center justify-center mr-3 mt-0.5">✓</span>
                <span>
                  <strong className="font-medium">Data-Driven:</strong> Every article, chart, and recommendation is backed by data.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent1 text-white flex items-center justify-center mr-3 mt-0.5">✓</span>
                <span>
                  <strong className="font-medium">Independent:</strong> We believe in unbiased research — no paid promotions or corporate sponsorships.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent1 text-white flex items-center justify-center mr-3 mt-0.5">✓</span>
                <span>
                  <strong className="font-medium">Global Perspective, Indian Focus:</strong> We connect global trends with India's evolving economy, giving you a 360° view.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent1 text-white flex items-center justify-center mr-3 mt-0.5">✓</span>
                <span>
                  <strong className="font-medium">User-First Design:</strong> Our platform is crafted to offer a clean, fast, and mobile-friendly experience.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Our Vision Section */}
      <div className="bg-indianmacro-50 dark:bg-indianmacro-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-6">Our Vision</h2>
          <p className="text-xl italic text-indianmacro-600 dark:text-indianmacro-300 max-w-3xl mx-auto mb-8">
            "To empower individuals and businesses with the knowledge to navigate India's financial future with confidence."
          </p>
          <p className="text-indianmacro-600 dark:text-indianmacro-300 max-w-2xl mx-auto">
            We envision Indian Macro becoming a trusted financial media platform that bridges the gap between raw data and practical decision-making.
          </p>
        </div>
      </div>
      
      {/* Join Our Community Section */}
      <div className="bg-white dark:bg-indianmacro-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-8">Join Our Community</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-2xl mx-auto mb-8">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link to="/newsletter">
                Subscribe to our Newsletter
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link to="/research">
                Follow our Research Blog
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <a href="https://www.linkedin.com/company/indian-macro" target="_blank" rel="noopener noreferrer">
                Connect with us on LinkedIn
              </a>
            </Button>
          </div>
          
          <p className="text-indianmacro-600 dark:text-indianmacro-300 mt-12 text-lg">
            Thank you for being part of our journey.
          </p>
          <p className="font-bold text-xl mt-2">
            Let's grow, learn, and invest — together. 🌟
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
