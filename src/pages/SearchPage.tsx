import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SearchResult {
  type: "market" | "news" | "research" | "education";
  title: string;
  description: string;
  url: string;
  date?: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement actual search API call
        // For now, returning mock results
        const mockResults: SearchResult[] = [
          {
            type: "market",
            title: "NIFTY 50 Live Market Data",
            description: "Real-time market data and analysis for NIFTY 50 index.",
            url: "/markets/nifty50",
            date: new Date().toLocaleDateString()
          },
          {
            type: "news",
            title: "RBI Monetary Policy Update",
            description: "Latest updates on RBI's monetary policy decisions and impact on markets.",
            url: "/news/rbi-policy",
            date: new Date().toLocaleDateString()
          },
          {
            type: "research",
            title: "Indian Economy Analysis",
            description: "In-depth analysis of Indian economic indicators and trends.",
            url: "/research/economy",
            date: new Date().toLocaleDateString()
          }
        ];
        setResults(mockResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={`Search Results for "${query}" - IndianMacro`}
        description={`Search results for ${query} on IndianMacro platform.`}
      />
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          <p className="text-muted-foreground mb-8">
            Showing results for "{query}"
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
                          {result.type}
                        </span>
                        <h2 className="text-xl font-semibold mb-2">
                          <a href={result.url} className="hover:underline">
                            {result.title}
                          </a>
                        </h2>
                        <p className="text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                      {result.date && (
                        <span className="text-sm text-muted-foreground">
                          {result.date}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No results found for "{query}". Try different keywords or browse our categories.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage; 