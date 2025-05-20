
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResearchCard from "@/components/ResearchCard";
import { Skeleton } from "@/components/ui/skeleton";
import PageHero from "@/components/ui/page-hero";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock search results - in a real app, this would come from a search API
  const [results, setResults] = useState({
    all: 0,
    research: [
      {
        id: 1,
        title: "Indian Economy Q1 2025 Performance Analysis",
        category: "Economy",
        date: "2025-04-15",
        image: "/img/research/economy-report.jpg",
        url: "/research/indian-economy-q1-2025"
      },
      {
        id: 2,
        title: "Impact of Geopolitical Events on Indian Markets",
        category: "Markets",
        date: "2025-04-10",
        image: "/img/research/geopolitical-events.jpg",
        url: "/research/geopolitical-events-impact"
      },
      {
        id: 3,
        title: "RBI Monetary Policy Analysis - April 2025",
        category: "Policy",
        date: "2025-04-05",
        image: "/img/research/rbi-policy.jpg",
        url: "/research/rbi-monetary-policy-april-2025"
      }
    ],
    education: [
      {
        id: 1,
        title: "Understanding Indian Bond Markets",
        category: "Bonds",
        date: "2025-03-28",
        image: "/img/education/bond-markets.jpg",
        url: "/education/understanding-indian-bond-markets"
      },
      {
        id: 2,
        title: "A Beginner's Guide to Economic Indicators",
        category: "Basics",
        date: "2025-03-20",
        image: "/img/education/economic-indicators.jpg",
        url: "/education/beginners-guide-economic-indicators"
      }
    ],
    data: [
      {
        id: 1,
        title: "Indian GDP Growth Trends (2020-2025)",
        category: "Economy",
        date: "2025-03-15",
        image: "/img/data/gdp-trends.jpg",
        url: "/data-dashboard/economic-indicators"
      },
      {
        id: 2,
        title: "Stock Market Performance (Nifty 50)",
        category: "Markets",
        date: "2025-03-10",
        image: "/img/data/stock-performance.jpg",
        url: "/data-dashboard/markets"
      }
    ]
  });

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const performSearch = (searchText: string) => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be an actual search API call
      // For now, we'll just use our mock data
      
      // Calculate total results
      const totalResults = 
        results.research.length + 
        results.education.length + 
        results.data.length;
      
      setResults({
        ...results,
        all: totalResults
      });
      
      setIsSearching(false);
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`Search Results for "${searchQuery}" | IndianMacro`}
        description={`Search results for "${searchQuery}" - Find research, educational content, and data related to Indian economy and financial markets.`}
        canonicalUrl={`/search?q=${encodeURIComponent(searchQuery)}`}
      />
      
      <header>
        <Navbar />
      </header>
      
      <PageHero 
        title={searchQuery ? `Search Results: "${searchQuery}"` : "Search"} 
        description="Search through our research, educational content, and data"
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Search IndianMacro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for research, educational content, data..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {query && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>
        
        {searchQuery && (
          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Results ({results.all})</TabsTrigger>
                <TabsTrigger value="research">Research ({results.research.length})</TabsTrigger>
                <TabsTrigger value="education">Education ({results.education.length})</TabsTrigger>
                <TabsTrigger value="data">Data ({results.data.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isSearching ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.all > 0 ? (
                  <div className="space-y-8">
                    {results.research.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Research Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.research.map((item) => (
                            <ResearchCard
                              key={item.id}
                              title={item.title}
                              category={item.category}
                              date={item.date}
                              image={item.image}
                              href={item.url}
                              description="Search result from research section"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {results.education.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Educational Content</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.education.map((item) => (
                            <ResearchCard
                              key={item.id}
                              title={item.title}
                              category={item.category}
                              date={item.date}
                              image={item.image}
                              href={item.url}
                              description="Educational content search result"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {results.data.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Data Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.data.map((item) => (
                            <ResearchCard
                              key={item.id}
                              title={item.title}
                              category={item.category}
                              date={item.date}
                              image={item.image}
                              href={item.url}
                              description="Data dashboard result"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg mb-2">No results found for "{searchQuery}"</p>
                    <p className="text-muted-foreground">Try different keywords or browse our content categories</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="research">
                {isSearching ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.research.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.research.map((item) => (
                      <ResearchCard
                        key={item.id}
                        title={item.title}
                        category={item.category}
                        date={item.date}
                        image={item.image}
                        href={item.url}
                        description="Research article search result"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg mb-2">No research results found for "{searchQuery}"</p>
                    <p className="text-muted-foreground">Try different keywords or browse our research section</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Education and Data tabs follow the same pattern */}
              <TabsContent value="education">
                {/* Education tab content similar to research */}
                {isSearching ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.education.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.education.map((item) => (
                      <ResearchCard
                        key={item.id}
                        title={item.title}
                        category={item.category}
                        date={item.date}
                        image={item.image}
                        href={item.url}
                        description="Educational content search result"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg mb-2">No educational content found for "{searchQuery}"</p>
                    <p className="text-muted-foreground">Try different keywords or browse our education section</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="data">
                {/* Data tab content similar to research */}
                {isSearching ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.data.map((item) => (
                      <ResearchCard
                        key={item.id}
                        title={item.title}
                        category={item.category}
                        date={item.date}
                        image={item.image}
                        href={item.url}
                        description="Data dashboard search result"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg mb-2">No data resources found for "{searchQuery}"</p>
                    <p className="text-muted-foreground">Try different keywords or browse our data dashboard</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
