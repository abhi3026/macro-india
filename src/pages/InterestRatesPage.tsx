import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";

export default function InterestRatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Interest Rates & Bonds | Macro India</title>
        <meta
          name="description"
          content="Track interest rates, bond yields, and monetary policy data for India."
        />
      </Helmet>
      
      <Navbar />
      <MarketTickerLive />
      
      <main className="flex-1 pt-4 pb-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Interest Rates & Bonds</h1>
            <p className="text-muted-foreground">
              Monitor key interest rates, bond yields, and monetary policy indicators
            </p>
          </section>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                We are working on bringing you comprehensive interest rates and bond market data.
                Check back soon for updates.
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 