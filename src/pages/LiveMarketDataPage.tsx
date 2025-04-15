
import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DataWidget from "@/components/DataWidget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for different markets
const MOCK_DATA = {
  indianIndices: [
    {
      name: "Nifty 50",
      value: "22,502.00",
      change: "+105.50",
      percentChange: "+0.47%",
      trend: "up",
      chartData: {
        labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
        datasets: [
          {
            label: "Price",
            data: [22390, 22410, 22450, 22440, 22470, 22495, 22502],
            borderColor: "#10b981",
          },
        ],
      },
    },
    {
      name: "Sensex",
      value: "74,016.95",
      change: "-103.70",
      percentChange: "-0.14%",
      trend: "down",
      chartData: {
        labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
        datasets: [
          {
            label: "Price",
            data: [74100, 74050, 74200, 74150, 74120, 74080, 74017],
            borderColor: "#ef4444",
          },
        ],
      },
    },
  ],
  usIndices: [
    {
      name: "S&P 500",
      value: "5,218.10",
      change: "+32.64",
      percentChange: "+0.63%",
      trend: "up",
      chartData: {
        labels: ["9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30"],
        datasets: [
          {
            label: "Price",
            data: [5185, 5190, 5195, 5205, 5210, 5215, 5218],
            borderColor: "#10b981",
          },
        ],
      },
    },
    {
      name: "Nasdaq",
      value: "16,399.52",
      change: "-89.20",
      percentChange: "-0.54%",
      trend: "down",
      chartData: {
        labels: ["9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30"],
        datasets: [
          {
            label: "Price",
            data: [16450, 16440, 16420, 16410, 16405, 16400, 16400],
            borderColor: "#ef4444",
          },
        ],
      },
    },
  ],
  crypto: [
    {
      name: "Bitcoin (BTC)",
      value: "$61,243.50",
      change: "+$1,253.12",
      percentChange: "+2.09%",
      trend: "up",
      chartData: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        datasets: [
          {
            label: "Price",
            data: [60000, 60150, 60300, 60750, 61000, 61150, 61243],
            borderColor: "#10b981",
          },
        ],
      },
    },
    {
      name: "Ethereum (ETH)",
      value: "$3,085.76",
      change: "+$45.23",
      percentChange: "+1.49%",
      trend: "up",
      chartData: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        datasets: [
          {
            label: "Price",
            data: [3040, 3045, 3055, 3060, 3070, 3080, 3086],
            borderColor: "#10b981",
          },
        ],
      },
    },
    {
      name: "Ripple (XRP)",
      value: "$0.5227",
      change: "-$0.0123",
      percentChange: "-2.30%",
      trend: "down",
      chartData: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        datasets: [
          {
            label: "Price",
            data: [0.535, 0.531, 0.530, 0.528, 0.525, 0.523, 0.523],
            borderColor: "#ef4444",
          },
        ],
      },
    },
  ],
};

const LiveMarketDataPage = () => {
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
      toast({
        title: "Market data refreshed",
        description: `Data updated as of ${new Date().toLocaleTimeString()}`,
      });
    }, 1500);
  };

  useEffect(() => {
    // Auto refresh every 5 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Live Market Data</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="indian" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="indian">Indian Markets</TabsTrigger>
            <TabsTrigger value="us">US Markets</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          </TabsList>

          {/* Indian Markets */}
          <TabsContent value="indian">
            <div className="grid md:grid-cols-2 gap-6">
              {MOCK_DATA.indianIndices.map((index) => (
                <DataWidget
                  key={index.name}
                  title={index.name}
                  description="Live market data"
                  chartType="area"
                  data={index.chartData}
                  latestValue={index.value}
                  latestDate={`${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`}
                  trend={index.trend as "up" | "down"}
                />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Indian Market Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Index</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>% Change</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_DATA.indianIndices.map((index) => (
                        <TableRow key={index.name}>
                          <TableCell className="font-medium">{index.name}</TableCell>
                          <TableCell>{index.value}</TableCell>
                          <TableCell>{index.change}</TableCell>
                          <TableCell>{index.percentChange}</TableCell>
                          <TableCell>
                            <Badge variant={index.trend === "up" ? "outline" : "destructive"} className="font-normal">
                              {index.trend === "up" ? (
                                <ArrowUp className="h-3 w-3 mr-1 text-accent2" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1 text-accent3" />
                              )}
                              {index.trend === "up" ? "Increasing" : "Decreasing"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* US Markets */}
          <TabsContent value="us">
            <div className="grid md:grid-cols-2 gap-6">
              {MOCK_DATA.usIndices.map((index) => (
                <DataWidget
                  key={index.name}
                  title={index.name}
                  description="Live market data"
                  chartType="area"
                  data={index.chartData}
                  latestValue={index.value}
                  latestDate={`${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`}
                  trend={index.trend as "up" | "down"}
                />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>US Market Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Index</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>% Change</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_DATA.usIndices.map((index) => (
                        <TableRow key={index.name}>
                          <TableCell className="font-medium">{index.name}</TableCell>
                          <TableCell>{index.value}</TableCell>
                          <TableCell>{index.change}</TableCell>
                          <TableCell>{index.percentChange}</TableCell>
                          <TableCell>
                            <Badge variant={index.trend === "up" ? "outline" : "destructive"} className="font-normal">
                              {index.trend === "up" ? (
                                <ArrowUp className="h-3 w-3 mr-1 text-accent2" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1 text-accent3" />
                              )}
                              {index.trend === "up" ? "Increasing" : "Decreasing"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cryptocurrencies */}
          <TabsContent value="crypto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.crypto.map((crypto) => (
                <DataWidget
                  key={crypto.name}
                  title={crypto.name}
                  description="24-hour market data"
                  chartType="area"
                  data={crypto.chartData}
                  latestValue={crypto.value}
                  latestDate={`${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`}
                  trend={crypto.trend as "up" | "down"}
                />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Cryptocurrency Market Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>% Change</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_DATA.crypto.map((crypto) => (
                        <TableRow key={crypto.name}>
                          <TableCell className="font-medium">{crypto.name}</TableCell>
                          <TableCell>{crypto.value}</TableCell>
                          <TableCell>{crypto.change}</TableCell>
                          <TableCell>{crypto.percentChange}</TableCell>
                          <TableCell>
                            <Badge variant={crypto.trend === "up" ? "outline" : "destructive"} className="font-normal">
                              {crypto.trend === "up" ? (
                                <ArrowUp className="h-3 w-3 mr-1 text-accent2" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1 text-accent3" />
                              )}
                              {crypto.trend === "up" ? "Increasing" : "Decreasing"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default LiveMarketDataPage;
