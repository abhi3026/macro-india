import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import { Helmet } from "react-helmet-async";
import { PageHeader } from "@/components/ui/page-header";

const DataDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Data Dashboard | Macro India</title>
        <meta
          name="description"
          content="Explore comprehensive data and analytics on the Indian economy and financial markets."
        />
      </Helmet>
      
      <Navbar />
      <MarketTickerLive />
      
      <main className="flex-1">
        <PageHeader 
          title="Data Dashboard"
          description="Explore comprehensive data and analytics on the Indian economy and financial markets."
        />
        
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Data Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Access comprehensive financial market data, economic indicators, and real-time updates all in one place.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/data-dashboard/markets">
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

            <Link to="/data-dashboard/economic-indicators">
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

            <Link to="/data-dashboard/interest-rates-bonds">
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

export default DataDashboardPage; 