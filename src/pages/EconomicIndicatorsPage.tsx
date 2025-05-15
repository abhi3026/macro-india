import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTickerLive from "@/components/MarketTickerLive";
import PageHero from "@/components/ui/page-hero";
import { EconomicTable, EconomicData } from "@/components/ui/economic-table";

export default function EconomicIndicatorsPage() {
  const defaultCountries: EconomicData[] = [
    {
      flag: "/flags/in.svg",
      country: "India",
      gdp: 3534.74,
      gdpGrowth: 7.2,
      pmi: 56.7,
      unemployment: 7.1,
      inflation: 5.1,
      exports: 453.2,
      businessConfidence: 55.3,
      consumerConfidence: 83.7
    },
    {
      flag: "/flags/us.svg",
      country: "United States",
      gdp: 25462.73,
      gdpGrowth: 2.5,
      pmi: 52.3,
      unemployment: 3.7,
      inflation: 3.1,
      exports: 3096.5,
      businessConfidence: 51.8,
      consumerConfidence: 79.2
    },
    {
      flag: "/flags/gb.svg",
      country: "United Kingdom",
      gdp: 3070.67,
      gdpGrowth: 0.3,
      pmi: 49.2,
      unemployment: 4.2,
      inflation: 4.0,
      exports: 741.8,
      businessConfidence: 48.7,
      consumerConfidence: 76.4
    },
    {
      flag: "/flags/eu.svg",
      country: "European Union",
      gdp: 16800.23,
      gdpGrowth: 0.1,
      pmi: 47.9,
      unemployment: 6.4,
      inflation: 2.8,
      exports: 2849.3,
      businessConfidence: 46.5,
      consumerConfidence: 71.8
    },
    {
      flag: "/flags/cn.svg",
      country: "China",
      gdp: 17963.17,
      gdpGrowth: 5.2,
      pmi: 50.8,
      unemployment: 5.1,
      inflation: 0.2,
      exports: 3710.6,
      businessConfidence: 50.2,
      consumerConfidence: 88.5
    },
    {
      flag: "/flags/jp.svg",
      country: "Japan",
      gdp: 4231.14,
      gdpGrowth: 1.1,
      pmi: 48.2,
      unemployment: 2.5,
      inflation: 2.6,
      exports: 915.7,
      businessConfidence: 47.8,
      consumerConfidence: 74.6
    },
    {
      flag: "/flags/au.svg",
      country: "Australia",
      gdp: 1675.42,
      gdpGrowth: 1.5,
      pmi: 47.3,
      unemployment: 3.9,
      inflation: 4.1,
      exports: 401.8,
      businessConfidence: 46.9,
      consumerConfidence: 77.3
    },
    {
      flag: "/flags/ca.svg",
      country: "Canada",
      gdp: 2139.84,
      gdpGrowth: 1.1,
      pmi: 46.8,
      unemployment: 5.7,
      inflation: 3.4,
      exports: 592.4,
      businessConfidence: 45.7,
      consumerConfidence: 75.9
    },
    {
      flag: "/flags/br.svg",
      country: "Brazil",
      gdp: 1894.93,
      gdpGrowth: 3.0,
      pmi: 53.1,
      unemployment: 7.4,
      inflation: 4.5,
      exports: 339.1,
      businessConfidence: 52.4,
      consumerConfidence: 82.1
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Economic Indicators | Macro India</title>
        <meta
          name="description"
          content="Track key economic indicators of the Indian economy."
        />
      </Helmet>
      
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Economic Indicators"
        description="Track key economic indicators of the Indian economy"
      />
      
      <main className="flex-1 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Economic Indicators</h1>
            <p className="text-muted-foreground">
              Track and analyze key economic indicators that drive India's economy
            </p>
          </section>

          <Card className="p-6">
            <EconomicTable 
              data={defaultCountries}
              onViewMore={() => {
                // Handle view more action
                console.log("View more clicked");
              }}
            />
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
