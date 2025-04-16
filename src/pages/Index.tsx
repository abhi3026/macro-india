
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { updateMetaTags } from "@/utils/metaTags";
import MarketTickerLive from "@/components/MarketTickerLive";

const Index = () => {
  useEffect(() => {
    updateMetaTags(
      "IndianMacro - India's Premier Economic & Financial Data Platform",
      "Access comprehensive Indian economic data, financial research, and market insights. Discover in-depth analysis of Indian economy, markets, and financial trends.",
      "/"
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MarketTickerLive />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indianmacro-900">Welcome to IndianMacro</h1>
          <p className="text-xl text-gray-600 mb-8">Your comprehensive source for Indian economic data, research, and financial analysis.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent1 hover:bg-accent1/90">
              <Link to="/research">
                Explore Research
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/live-markets">
                View Live Markets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
