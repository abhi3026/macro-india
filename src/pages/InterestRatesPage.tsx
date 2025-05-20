
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import MarketTickerLive from "@/components/MarketTickerLive";

interface RateData {
  country: string;
  flag: string;
  interestRate: {
    rate: number;
    change: number;
    lastUpdated: string;
  };
  bondYield: {
    rate: number;
    change: number;
    lastUpdated: string;
  };
}

const InterestRatesPage = () => {
  const [rates, setRates] = useState<RateData[]>([
    { 
      country: "India", 
      flag: "🇮🇳",
      interestRate: { rate: 6.50, change: 0, lastUpdated: "2024-02-08" },
      bondYield: { rate: 7.12, change: -0.05, lastUpdated: "2024-02-20" }
    },
    { 
      country: "USA", 
      flag: "🇺🇸",
      interestRate: { rate: 5.50, change: 0, lastUpdated: "2024-01-31" },
      bondYield: { rate: 4.28, change: 0.03, lastUpdated: "2024-02-20" }
    },
    { 
      country: "UK", 
      flag: "🇬🇧",
      interestRate: { rate: 5.25, change: 0, lastUpdated: "2024-02-01" },
      bondYield: { rate: 4.12, change: -0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "EU", 
      flag: "🇪🇺",
      interestRate: { rate: 4.50, change: 0, lastUpdated: "2024-01-25" },
      bondYield: { rate: 2.85, change: 0.01, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Japan", 
      flag: "🇯🇵",
      interestRate: { rate: -0.10, change: 0, lastUpdated: "2024-01-23" },
      bondYield: { rate: 0.72, change: 0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "China", 
      flag: "🇨🇳",
      interestRate: { rate: 3.45, change: -0.25, lastUpdated: "2024-02-20" },
      bondYield: { rate: 2.45, change: -0.03, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Brazil", 
      flag: "🇧🇷",
      interestRate: { rate: 10.75, change: -0.50, lastUpdated: "2024-02-15" },
      bondYield: { rate: 10.92, change: -0.15, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Russia", 
      flag: "🇷🇺",
      interestRate: { rate: 16.00, change: 0, lastUpdated: "2024-02-16" },
      bondYield: { rate: 12.85, change: 0.05, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Australia", 
      flag: "🇦🇺",
      interestRate: { rate: 4.35, change: 0, lastUpdated: "2024-02-06" },
      bondYield: { rate: 4.26, change: 0.03, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Canada", 
      flag: "🇨🇦",
      interestRate: { rate: 5.00, change: 0, lastUpdated: "2024-01-24" },
      bondYield: { rate: 3.62, change: 0.01, lastUpdated: "2024-02-20" }
    },
    { 
      country: "South Korea", 
      flag: "🇰🇷",
      interestRate: { rate: 3.50, change: 0, lastUpdated: "2024-02-22" },
      bondYield: { rate: 3.85, change: -0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Switzerland", 
      flag: "🇨🇭",
      interestRate: { rate: 1.75, change: 0, lastUpdated: "2024-03-21" },
      bondYield: { rate: 1.05, change: 0.02, lastUpdated: "2024-03-21" }
    },
    { 
      country: "South Africa", 
      flag: "🇿🇦",
      interestRate: { rate: 8.25, change: 0, lastUpdated: "2024-01-25" },
      bondYield: { rate: 12.26, change: 0.01, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Mexico", 
      flag: "🇲🇽",
      interestRate: { rate: 11.25, change: -0.25, lastUpdated: "2024-03-21" },
      bondYield: { rate: 9.48, change: -0.10, lastUpdated: "2024-03-21" }
    },
    { 
      country: "Indonesia", 
      flag: "🇮🇩",
      interestRate: { rate: 6.25, change: 0, lastUpdated: "2024-02-15" },
      bondYield: { rate: 6.65, change: -0.04, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Turkey", 
      flag: "🇹🇷",
      interestRate: { rate: 45.00, change: 0, lastUpdated: "2024-03-21" },
      bondYield: { rate: 28.35, change: -0.15, lastUpdated: "2024-03-21" }
    },
    { 
      country: "Saudi Arabia", 
      flag: "🇸🇦",
      interestRate: { rate: 5.50, change: 0, lastUpdated: "2024-02-22" },
      bondYield: { rate: 5.12, change: 0.01, lastUpdated: "2024-02-22" }
    },
    { 
      country: "Singapore", 
      flag: "🇸🇬",
      interestRate: { rate: 3.85, change: 0, lastUpdated: "2024-02-23" },
      bondYield: { rate: 3.25, change: -0.01, lastUpdated: "2024-02-23" }
    },
    { 
      country: "Malaysia", 
      flag: "🇲🇾",
      interestRate: { rate: 3.00, change: 0, lastUpdated: "2024-01-24" },
      bondYield: { rate: 3.95, change: 0.02, lastUpdated: "2024-02-20" }
    },
    { 
      country: "Thailand", 
      flag: "🇹🇭",
      interestRate: { rate: 2.50, change: 0, lastUpdated: "2024-02-07" },
      bondYield: { rate: 2.85, change: -0.01, lastUpdated: "2024-02-20" }
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Interest Rates & Bond Yields | IndianMacro"
        description="Track global interest rates and government bond yields across major economies."
        canonicalUrl="/interest-rates"
        keywords="interest rates, bond yields, global economy, central banks, monetary policy"
      />
      
      <header>
        <Navbar />
      </header>
      
      <MarketTickerLive />
      
      <PageHero 
        title="Interest Rates & Bond Yields" 
        description="Track central bank rates and government bond yields across major economies"
      />
      
      <main className="flex-1 pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-accent1" />
                  Global Interest Rates & Bond Yields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Country</TableHead>
                        <TableHead className="text-right">Policy Rate (%)</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">Last Change</TableHead>
                        <TableHead className="text-right">10Y Bond Yield (%)</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">Last Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rates.map((rate) => (
                        <TableRow key={rate.country}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-base">{rate.flag}</span>
                              <span className="font-medium">{rate.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {rate.interestRate.rate.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              "font-medium",
                              rate.interestRate.change > 0 ? "text-green-600 dark:text-green-400" : 
                              rate.interestRate.change < 0 ? "text-red-600 dark:text-red-400" : 
                              "text-muted-foreground"
                            )}>
                              {rate.interestRate.change > 0 ? '+' : ''}
                              {rate.interestRate.change !== 0 ? `${rate.interestRate.change.toFixed(2)}%` : '-'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(rate.interestRate.lastUpdated).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {rate.bondYield.rate.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              "font-medium",
                              rate.bondYield.change > 0 ? "text-green-600 dark:text-green-400" : 
                              rate.bondYield.change < 0 ? "text-red-600 dark:text-red-400" : 
                              "text-muted-foreground"
                            )}>
                              {rate.bondYield.change > 0 ? '+' : ''}
                              {rate.bondYield.change !== 0 ? `${rate.bondYield.change.toFixed(2)}%` : '-'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(rate.bondYield.lastUpdated).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-accent1" />
                  Interest Rate Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <p>Interest Rate chart data visualization would appear here</p>
                  <p className="text-sm mt-2">Showing historical trends across major economies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterestRatesPage;
