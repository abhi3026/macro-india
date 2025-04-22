import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen, BarChart2, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageHeader } from "@/components/ui/page-header";

const ResearchPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const researchCategories = [
    {
      title: "Market Analysis",
      description: "In-depth analysis of Indian financial markets, trends, and opportunities",
      icon: <BarChart2 className="h-6 w-6" />,
      link: "/research/market-analysis"
    },
    {
      title: "Economic Reports",
      description: "Comprehensive reports on Indian economic indicators and their implications",
      icon: <FileText className="h-6 w-6" />,
      link: "/research/economic-reports"
    },
    {
      title: "Policy Insights",
      description: "Analysis of government policies and their impact on the economy",
      icon: <BookOpen className="h-6 w-6" />,
      link: "/research/policy-insights"
    },
    {
      title: "Market Trends",
      description: "Latest trends and patterns in Indian financial markets",
      icon: <TrendingUp className="h-6 w-6" />,
      link: "/research/market-trends"
    }
  ];

  const latestResearch = [
    {
      title: "Indian Economy Q1 2024 Outlook",
      date: "March 15, 2024",
      category: "Economic Reports",
      summary: "Analysis of India's economic performance in Q1 2024 and future projections",
      link: "/research/indian-economy-q1-2024"
    },
    {
      title: "RBI Policy Impact Analysis",
      date: "March 10, 2024",
      category: "Policy Insights",
      summary: "Detailed analysis of the latest RBI monetary policy and its market implications",
      link: "/research/rbi-policy-march-2024"
    },
    {
      title: "Indian Stock Market Trends",
      date: "March 5, 2024",
      category: "Market Analysis",
      summary: "Comprehensive review of Indian stock market performance and sector analysis",
      link: "/research/stock-market-trends-march-2024"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Research | Macro India</title>
        <meta
          name="description"
          content="Access in-depth research and analysis on the Indian economy and financial markets."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Research"
          description="Access in-depth research and analysis on the Indian economy and financial markets."
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Research & Analysis</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive research and analysis of Indian economy, markets, and policy insights
            </p>
          </div>

          {/* Research Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {researchCategories.map((category) => (
              <Link
                key={category.title}
                to={category.link}
                className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-indianmacro-500 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indianmacro-100 rounded-lg text-indianmacro-600 group-hover:bg-indianmacro-200 transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-indianmacro-600 group-hover:text-indianmacro-700">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* Latest Research */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Research</h2>
            <div className="space-y-6">
              {latestResearch.map((research) => (
                <Link
                  key={research.title}
                  to={research.link}
                  className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-indianmacro-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{research.title}</h3>
                      <p className="text-gray-600 mb-4">{research.summary}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{research.category}</span>
                        <span className="mx-2">•</span>
                        <span>{research.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-indianmacro-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-indianmacro-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our research newsletter to receive the latest insights and analysis directly in your inbox.
            </p>
            <Link
              to="/newsletter"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indianmacro-600 hover:bg-indianmacro-700"
            >
              Subscribe to Newsletter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;
