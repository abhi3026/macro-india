
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import SEOHead from "@/components/SEOHead";
import { updateMetaTags } from "@/utils/metaTags";

const DashboardPage = () => {
  useEffect(() => {
    updateMetaTags(
      "Data Dashboard | IndianMacro",
      "Explore comprehensive data and analytics on the Indian economy and financial markets.",
      "/dashboard"
    );
    
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Data Dashboard | IndianMacro"
        description="Explore comprehensive data and analytics on the Indian economy and financial markets."
        canonicalUrl="/dashboard"
      />
      
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <Navbar />
      </header>
      
      <div className="border-b border-border">
        <MarketTickerLive />
      </div>
      
      <PageHeader 
        title="Data Dashboard" 
        description="Access comprehensive financial market data, economic indicators, and real-time updates all in one place."
      />
      
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/live-markets">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Markets
                  </CardTitle>
                  <CardDescription>Live market data for indices, stocks, crypto, forex, and commodities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View real-time market data and trends across global financial markets.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/economic-indicators">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Economic Indicators
                  </CardTitle>
                  <CardDescription>Key economic indicators and data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Track important economic indicators and their trends over time.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/interest-rates">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Interest Rates & Bonds
                  </CardTitle>
                  <CardDescription>Global interest rates and bond market data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Monitor interest rates, bond yields, and central bank policies.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
