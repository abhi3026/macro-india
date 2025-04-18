
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Type for index data
interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  chartData?: number[];
}

// Mock data for indices
const INDICES_DATA: { [key: string]: IndexData[] } = {
  indian: [
    {
      name: "NIFTY 50",
      value: 22365.50,
      change: 125.75,
      changePercent: 0.57,
      lastUpdated: "15 min ago",
      chartData: [21500, 21750, 22000, 21800, 22100, 22200, 22365]
    },
    {
      name: "SENSEX",
      value: 73546.44,
      change: 413.81,
      changePercent: 0.56,
      lastUpdated: "15 min ago",
      chartData: [71000, 71500, 72000, 72500, 73000, 73200, 73546]
    },
    {
      name: "NIFTY Bank",
      value: 48450.75,
      change: -125.30,
      changePercent: -0.26,
      lastUpdated: "15 min ago",
      chartData: [48900, 48700, 48600, 48500, 48200, 48300, 48450]
    },
    {
      name: "NIFTY IT",
      value: 34678.90,
      change: 234.50,
      changePercent: 0.68,
      lastUpdated: "15 min ago",
      chartData: [33900, 34100, 34300, 34200, 34500, 34600, 34678]
    }
  ],
  global: [
    {
      name: "Dow Jones",
      value: 38755.30,
      change: 195.89,
      changePercent: 0.51,
      lastUpdated: "15 min ago",
      chartData: [38000, 38200, 38400, 38300, 38500, 38600, 38755]
    },
    {
      name: "S&P 500",
      value: 5127.79,
      change: 34.15,
      changePercent: 0.67,
      lastUpdated: "15 min ago",
      chartData: [5000, 5050, 5080, 5060, 5100, 5110, 5127]
    },
    {
      name: "NASDAQ",
      value: 16315.25,
      change: 183.40,
      changePercent: 1.14,
      lastUpdated: "15 min ago",
      chartData: [15800, 15900, 16000, 16100, 16200, 16250, 16315]
    },
    {
      name: "FTSE 100",
      value: 7725.15,
      change: -45.80,
      changePercent: -0.59,
      lastUpdated: "15 min ago",
      chartData: [7850, 7800, 7780, 7760, 7740, 7730, 7725]
    }
  ],
  asian: [
    {
      name: "Nikkei 225",
      value: 37870.20,
      change: -123.45,
      changePercent: -0.32,
      lastUpdated: "15 min ago",
      chartData: [38100, 38050, 38000, 37950, 37900, 37890, 37870]
    },
    {
      name: "Hang Seng",
      value: 17525.40,
      change: 176.53,
      changePercent: 1.02,
      lastUpdated: "15 min ago",
      chartData: [17100, 17200, 17300, 17400, 17450, 17500, 17525]
    },
    {
      name: "Shanghai",
      value: 3048.75,
      change: 12.50,
      changePercent: 0.41,
      lastUpdated: "15 min ago",
      chartData: [3000, 3015, 3025, 3035, 3040, 3045, 3048]
    },
    {
      name: "KOSPI",
      value: 2645.90,
      change: 15.30,
      changePercent: 0.58,
      lastUpdated: "15 min ago",
      chartData: [2600, 2610, 2620, 2630, 2635, 2640, 2645]
    }
  ],
  commodities: [
    {
      name: "Gold",
      value: 2325.60,
      change: 15.20,
      changePercent: 0.66,
      lastUpdated: "15 min ago",
      chartData: [2280, 2290, 2300, 2310, 2315, 2320, 2325]
    },
    {
      name: "Silver",
      value: 27.35,
      change: 0.45,
      changePercent: 1.67,
      lastUpdated: "15 min ago",
      chartData: [26.5, 26.7, 26.9, 27.0, 27.1, 27.2, 27.35]
    },
    {
      name: "Crude Oil",
      value: 82.45,
      change: -1.20,
      changePercent: -1.44,
      lastUpdated: "15 min ago",
      chartData: [84.5, 84.0, 83.5, 83.0, 82.8, 82.6, 82.45]
    },
    {
      name: "Natural Gas",
      value: 1.85,
      change: 0.05,
      changePercent: 2.78,
      lastUpdated: "15 min ago",
      chartData: [1.70, 1.72, 1.75, 1.78, 1.80, 1.82, 1.85]
    }
  ]
};

const WorldIndices = () => {
  const [activeTab, setActiveTab] = useState("indian");
  const [chartView, setChartView] = useState("sparkline"); // 'sparkline' or 'bar'

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>World Indices</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 px-2",
                chartView === "sparkline" && "bg-muted"
              )}
              onClick={() => setChartView("sparkline")}
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 px-2",
                chartView === "bar" && "bg-muted"
              )}
              onClick={() => setChartView("bar")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="indian" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="indian">Indian</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="asian">Asian</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
          </TabsList>
          
          {Object.keys(INDICES_DATA).map((region) => (
            <TabsContent key={region} value={region} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INDICES_DATA[region].map((index) => (
                  <div key={index.name} className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{index.name}</h3>
                        <p className="text-2xl font-bold">{index.value.toLocaleString()}</p>
                      </div>
                      <div className={cn(
                        "flex items-center px-2 py-1 rounded text-sm",
                        index.change >= 0 
                          ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20" 
                          : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                      )}>
                        {index.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span>
                          {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} 
                          &nbsp;({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    
                    {/* Chart visualization */}
                    {chartView === "sparkline" && (
                      <div className="h-10 w-full mt-2">
                        <svg viewBox="0 0 100 30" className="w-full h-full">
                          <polyline
                            points={
                              index.chartData?.map((value, i) => 
                                `${(i / (index.chartData.length - 1)) * 100},${
                                  30 - ((value - Math.min(...index.chartData)) / 
                                  (Math.max(...index.chartData) - Math.min(...index.chartData)) * 25)
                                }`
                              ).join(' ') || ''
                            }
                            fill="none"
                            stroke={index.change >= 0 ? "#16a34a" : "#dc2626"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    
                    {chartView === "bar" && (
                      <div className="h-10 w-full mt-2 flex items-end justify-between">
                        {index.chartData?.map((value, i) => {
                          const normalizedHeight = ((value - Math.min(...index.chartData)) / 
                                                   (Math.max(...index.chartData) - Math.min(...index.chartData))) * 100;
                          return (
                            <div
                              key={i}
                              style={{ height: `${normalizedHeight}%` }}
                              className={cn(
                                "w-[8%]",
                                index.change >= 0 ? "bg-green-500" : "bg-red-500"
                              )}
                            ></div>
                          );
                        })}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">Updated {index.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorldIndices;
