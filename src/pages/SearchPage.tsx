
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Card, CardContent } from "@/components/ui/card";
import ResearchCard from "@/components/ResearchCard";
import SearchSuggestions from "@/components/SearchSuggestions";

// Mock search results for now
const mockData = {
  research: [
    { id: "1", title: "Impact of RBI Rate Hike on Indian Economy", category: "Monetary Policy", date: "2023-07-15", image: "/uploads/research-1.jpg", slug: "impact-rbi-rate-hike-indian-economy" },
    { id: "2", title: "Analysis of India's GDP Growth Forecast", category: "Economic Growth", date: "2023-06-25", image: "/uploads/research-2.jpg", slug: "analysis-india-gdp-growth-forecast" },
  ],
  news: [
    { id: "3", title: "India's Trade Deficit Widens to $28.86 Billion in July", category: "Trade", date: "2023-08-05", image: "/uploads/news-1.jpg", slug: "india-trade-deficit-widens-july" },
    { id: "4", title: "FDI in India Rises 10% to $22.7 Billion", category: "Investments", date: "2023-07-30", image: "/uploads/news-2.jpg", slug: "fdi-india-rises-10-percent" },
  ],
  education: [
    { id: "5", title: "Understanding India's Inflation Dynamics", category: "Inflation", date: "2023-05-20", image: "/uploads/education-1.jpg", slug: "understanding-india-inflation-dynamics" },
    { id: "6", title: "How to Interpret Economic Indicators", category: "Education", date: "2023-04-12", image: "/uploads/education-2.jpg", slug: "how-to-interpret-economic-indicators" },
  ]
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<{
    research: any[];
    news: any[];
    education: any[];
    total: number;
  }>({ research: [], news: [], education: [], total: 0 });
  
  useEffect(() => {
    if (query) {
      // In a real app, this would be an API call
      const searchResults = {
        research: mockData.research.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        ),
        news: mockData.news.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        ),
        education: mockData.education.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        )
      };
      
      const totalResults = searchResults.research.length + 
                          searchResults.news.length + 
                          searchResults.education.length;
      
      setResults({...searchResults, total: totalResults});
    } else {
      setResults({ research: [], news: [], education: [], total: 0 });
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{query ? `Search: ${query} | IndianMacro` : "Search | IndianMacro"}</title>
        <meta 
          name="description" 
          content={query ? `Search results for ${query} on IndianMacro` : "Search for research, news, and educational content on Indian economy and markets."} 
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <header>
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title={query ? `Search Results: ${query}` : "Search"} 
        description={results.total > 0 
          ? `Found ${results.total} results` 
          : query 
            ? "No results found" 
            : "Search for research, news, and educational content"
        } 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {query ? (
          <>
            {results.total > 0 ? (
              <div className="space-y-8">
                {results.research.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Research ({results.research.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.research.map(item => (
                        <ResearchCard 
                          key={item.id}
                          title={item.title}
                          category={item.category}
                          date={item.date}
                          image={item.image}
                          href={`/research/${item.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {results.news.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">News ({results.news.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.news.map(item => (
                        <ResearchCard 
                          key={item.id}
                          title={item.title}
                          category={item.category}
                          date={item.date}
                          image={item.image}
                          href={`/news/${item.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {results.education.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Education ({results.education.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.education.map(item => (
                        <ResearchCard 
                          key={item.id}
                          title={item.title}
                          category={item.category}
                          date={item.date}
                          image={item.image}
                          href={`/education/${item.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted">
                <CardContent className="pt-6 text-center">
                  <p className="text-xl mb-4">No results found for "{query}"</p>
                  <p className="text-muted-foreground">Try different keywords or check out our popular topics below:</p>
                  <SearchSuggestions />
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Popular Search Topics</h2>
            <SearchSuggestions />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
