
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import NewsletterModal from "@/components/NewsletterModal";
import ResearchCard, { ResearchItem } from "@/components/ResearchCard";
import BlogPostCard, { BlogPost } from "@/components/BlogPostCard";
import Markets from "@/components/Markets";
import EconomicIndicatorsDashboard from "@/components/EconomicIndicatorsDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingViewChart from "@/components/TradingViewChart";
import InterestRateTracker from "@/components/InterestRateTracker";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import NewsSnippets from "@/components/NewsSnippets";
import AdSpace from "@/components/AdSpace";
import { ArrowRight, FileText, BarChart, TrendingUp, Newspaper } from "lucide-react";

const HomePage = () => {
  // Featured research items (sample data)
  const featuredResearch: ResearchItem[] = [
    {
      id: "1",
      title: "Indian Economic Outlook 2025",
      description: "Comprehensive analysis of India's economic trajectory for the coming year with key indicators and growth projections.",
      date: "April 2, 2025",
      category: "Economic Outlook",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      fileUrl: "#",
      featured: true
    },
    {
      id: "2",
      title: "Impact of Monetary Policy on Indian Markets",
      description: "Analysis of how RBI's latest monetary policy decisions are affecting various sectors of the Indian economy.",
      date: "March 28, 2025",
      category: "Monetary Policy",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      fileUrl: "#"
    },
    {
      id: "3",
      title: "Agricultural Trends & Food Security",
      description: "Examination of current agricultural output, challenges, and implications for India's food security.",
      date: "March 20, 2025",
      category: "Agriculture",
      imageUrl: "https://images.unsplash.com/photo-1589256479193-9ff1356bed98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
      fileUrl: "#"
    }
  ];

  // Featured educational posts (sample data)
  const featuredPosts: BlogPost[] = [
    {
      id: "1",
      title: "Understanding India's Current Account Deficit",
      excerpt: "A deep dive into the factors affecting India's current account balance and its implications for the economy.",
      date: "April 5, 2025",
      readTime: "8 min read",
      author: {
        name: "Raj Sharma",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      category: "Trade Balance",
      imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      featured: true
    },
    {
      id: "2",
      title: "The Inflation Challenge: Navigating Rising Prices",
      excerpt: "Analysis of current inflation trends and strategies for businesses and consumers to adapt.",
      date: "April 1, 2025",
      readTime: "6 min read",
      author: {
        name: "Priya Desai",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      category: "Inflation",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Optimize images by setting loading="lazy" for images below the fold
    const lazyImages = document.querySelectorAll('img:not([loading])');
    lazyImages.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="IndianMacro | India's Macroeconomic Data & Research Platform"
        description="In-depth research, data analysis, and expert insights on Indian economy, markets, and financial trends."
        canonicalUrl="/"
      />
      
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>
      
      {/* Indices data bar */}
      <div className="border-b border-border">
        <MarketTickerLive />
      </div>
      
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white py-16 md:py-20">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50" 
            style={{ backgroundImage: `url('/hero-bg.svg')` }}
            aria-hidden="true"
          ></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-indianmacro-900 mb-6">
                Your Window to India's Macroeconomic Landscape
              </h1>
              <p className="text-lg md:text-xl text-indianmacro-600 mb-8">
                In-depth research, data analysis, and expert insights on Indian economy, markets, and financial trends.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent1 hover:bg-accent1/90 transition-colors">
                  <Link to="/research">
                    Explore Research
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-colors">
                  <Link to="/dashboard">
                    View Latest Data
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* TradingView and News Section */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* TradingView Chart - 3/4 width */}
              <div className="lg:col-span-3">
                <TradingViewChart height={400} />
              </div>
              
              {/* News Section - 1/4 width */}
              <div className="lg:col-span-1">
                <NewsSnippets />
              </div>
            </div>
          </div>
        </section>
        
        {/* Markets and Ad Space Section */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Markets Table - 3/4 width */}
              <div className="lg:col-span-3">
                <Markets />
              </div>
              
              {/* Ad Space - 1/4 width */}
              <div className="lg:col-span-1">
                <AdSpace />
              </div>
            </div>
          </div>
        </section>
        
        {/* Economic Indicators and Economic Calendar Section */}
        <section className="bg-indianmacro-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Economic Indicators - 3/4 width */}
              <div className="lg:col-span-3">
                <EconomicIndicatorsDashboard />
              </div>
              
              {/* Economic Calendar - 1/4 width */}
              <div className="lg:col-span-1">
                <EconomicCalendar />
              </div>
            </div>
          </div>
        </section>
        
        {/* Interest Rate Tracker Section */}
        <section className="bg-indianmacro-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Empty Space - 3/4 width */}
              <div className="lg:col-span-3">
                {/* This space is intentionally left empty as per the layout */}
              </div>
              
              {/* Interest Rate Tracker - 1/4 width */}
              <div className="lg:col-span-1">
                <InterestRateTracker />
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Research */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indianmacro-900">
                  Featured Research
                </h2>
                <p className="text-indianmacro-600 mt-2">
                  Our latest economic insights and analysis
                </p>
              </div>
              <Button asChild variant="ghost" className="group transition-colors">
                <Link to="/research" className="flex items-center">
                  View all 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResearch.map((item) => (
                <ResearchCard 
                  key={item.id} 
                  research={item} 
                  variant={item.featured ? "featured" : "default"} 
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Educational Content */}
        <section className="bg-indianmacro-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indianmacro-900">
                  Educational Resources
                </h2>
                <p className="text-indianmacro-600 mt-2">
                  Learn about macroeconomics and financial markets
                </p>
              </div>
              <Button asChild variant="ghost" className="group transition-colors">
                <Link to="/education" className="flex items-center">
                  View all resources
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <BlogPostCard 
                  key={post.id} 
                  post={post} 
                  variant={post.featured ? "featured" : "default"} 
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Features / Services */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-indianmacro-900">
                What We Offer
              </h2>
              <p className="text-indianmacro-600 mt-2 max-w-2xl mx-auto">
                Comprehensive resources to help you understand India's complex economy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <FileText className="h-10 w-10 text-accent1 mb-4" />
                  <CardTitle>Research Reports</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-indianmacro-600">
                    In-depth analysis of economic trends, sectors, policies, and markets with actionable insights.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <BarChart className="h-10 w-10 text-accent1 mb-4" />
                  <CardTitle>Data Visualization</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-indianmacro-600">
                    Interactive charts and dashboards presenting key economic indicators in an accessible format.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <TrendingUp className="h-10 w-10 text-accent1 mb-4" />
                  <CardTitle>Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-indianmacro-600">
                    Real-time market data, trends, and expert commentary on financial markets and investment insights.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <Newspaper className="h-10 w-10 text-accent1 mb-4" />
                  <CardTitle>Educational Content</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-indianmacro-600">
                    Easy-to-understand resources on economic concepts, financial literacy, and market fundamentals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <NewsletterModal />
    </div>
  );
};

export default HomePage;
