import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DataWidget, { DataWidgetProps } from "@/components/DataWidget";
import FeedbackForm from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, BarChart2, Activity, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample data for widgets
const economicIndicators: DataWidgetProps[] = [
  {
    title: "GDP Growth Rate",
    description: "Quarterly GDP growth (YoY)",
    chartType: "area",
    data: {
      labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"],
      datasets: [
        {
          label: "GDP Growth (%)",
          data: [6.1, 6.3, 6.7, 6.9, 7.2],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "7.2%",
    latestDate: "Q1 2025",
    trend: "up"
  },
  {
    title: "Inflation Rate (CPI)",
    description: "Monthly inflation data",
    chartType: "bar",
    data: {
      labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
      datasets: [
        {
          label: "Inflation Rate (%)",
          data: [5.7, 5.5, 5.1, 4.9, 4.7, 4.5],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.5)"
        }
      ]
    },
    latestValue: "4.5%",
    latestDate: "April 2025",
    trend: "down"
  },
  {
    title: "Unemployment Rate",
    description: "Monthly unemployment data",
    chartType: "area",
    data: {
      labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
      datasets: [
        {
          label: "Unemployment Rate (%)",
          data: [7.1, 7.3, 7.2, 7.0, 6.8, 6.6],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "6.6%",
    latestDate: "April 2025",
    trend: "down"
  },
  {
    title: "Foreign Exchange Reserves",
    description: "Weekly forex reserves (USD Billion)",
    chartType: "area",
    data: {
      labels: ["Feb 25", "Mar 3", "Mar 10", "Mar 17", "Mar 24", "Mar 31", "Apr 7"],
      datasets: [
        {
          label: "Forex Reserves (USD Bn)",
          data: [619.2, 623.5, 625.6, 628.4, 630.1, 631.5, 635.8],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "$635.8B",
    latestDate: "April 7, 2025",
    trend: "up"
  }
];

const financialMarkets: DataWidgetProps[] = [
  {
    title: "NIFTY 50",
    description: "Daily closing values",
    chartType: "area",
    data: {
      labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 8", "Apr 9"],
      datasets: [
        {
          label: "NIFTY 50",
          data: [21430, 21595, 21682, 21720, 21567, 21440, 21651],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "21,651.15",
    latestDate: "April 9, 2025",
    trend: "up"
  },
  {
    title: "USD/INR Exchange Rate",
    description: "Daily exchange rate",
    chartType: "area",
    data: {
      labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 8", "Apr 9"],
      datasets: [
        {
          label: "USD/INR",
          data: [83.15, 83.25, 83.31, 83.40, 83.28, 83.22, 83.02],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.5)"
        }
      ]
    },
    latestValue: "₹83.02",
    latestDate: "April 9, 2025",
    trend: "down"
  },
  {
    title: "10-Year G-Sec Yield",
    description: "Daily yield (%)",
    chartType: "area",
    data: {
      labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 8", "Apr 9"],
      datasets: [
        {
          label: "10Y Yield (%)",
          data: [7.05, 7.08, 7.12, 7.15, 7.18, 7.16, 7.14],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "7.14%",
    latestDate: "April 9, 2025",
    trend: "down"
  },
  {
    title: "BSE Bankex",
    description: "Banking sector index",
    chartType: "area",
    data: {
      labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 8", "Apr 9"],
      datasets: [
        {
          label: "BSE Bankex",
          data: [49620, 49850, 50120, 50380, 50140, 49980, 50210],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          fill: true
        }
      ]
    },
    latestValue: "50,210.32",
    latestDate: "April 9, 2025",
    trend: "up"
  }
];

const DashboardPage = () => {
  const [lastUpdated, setLastUpdated] = useState("April 10, 2025 09:30 AM");
  
  // Mock function to simulate data refresh
  const refreshData = () => {
    const now = new Date();
    setLastUpdated(
      `${now.toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      })} ${now.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
      })}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Data Dashboard</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Real-time visualization of key economic and financial indicators for the Indian economy.
          </p>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Tabs */}
          <Tabs defaultValue="economic" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="economic" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Economic Indicators</span>
                </TabsTrigger>
                <TabsTrigger value="markets" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Financial Markets</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Last updated: {lastUpdated}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={refreshData}
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Economic Indicators Tab */}
            <TabsContent value="economic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {economicIndicators.map((widget, index) => (
                  <DataWidget
                    key={index}
                    title={widget.title}
                    description={widget.description}
                    chartType={widget.chartType}
                    data={widget.data}
                    latestValue={widget.latestValue}
                    latestDate={widget.latestDate}
                    trend={widget.trend}
                  />
                ))}
              </div>
              
              {/* Additional Data Sources */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">External Data Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://www.rbi.org.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 border rounded-lg hover:bg-indianmacro-50 transition-colors"
                  >
                    <DollarSign className="h-10 w-10 text-indianmacro-600 mb-2" />
                    <h4 className="font-medium">RBI Data</h4>
                    <p className="text-sm text-center text-indianmacro-500">
                      Official monetary and financial statistics
                    </p>
                  </a>
                  
                  <a 
                    href="https://www.mospi.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 border rounded-lg hover:bg-indianmacro-50 transition-colors"
                  >
                    <BarChart2 className="h-10 w-10 text-indianmacro-600 mb-2" />
                    <h4 className="font-medium">MOSPI</h4>
                    <p className="text-sm text-center text-indianmacro-500">
                      Government statistical data and reports
                    </p>
                  </a>
                  
                  <a 
                    href="https://www.nseindia.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 border rounded-lg hover:bg-indianmacro-50 transition-colors"
                  >
                    <TrendingUp className="h-10 w-10 text-indianmacro-600 mb-2" />
                    <h4 className="font-medium">NSE Data</h4>
                    <p className="text-sm text-center text-indianmacro-500">
                      Stock market data and indices
                    </p>
                  </a>
                </div>
              </div>
            </TabsContent>
            
            {/* Financial Markets Tab */}
            <TabsContent value="markets">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {financialMarkets.map((widget, index) => (
                  <DataWidget
                    key={index}
                    title={widget.title}
                    description={widget.description}
                    chartType={widget.chartType}
                    data={widget.data}
                    latestValue={widget.latestValue}
                    latestDate={widget.latestDate}
                    trend={widget.trend}
                  />
                ))}
              </div>
              
              {/* TradingView Widget */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Market Overview</h3>
                <div className="border rounded-lg p-4 h-[400px] flex items-center justify-center bg-indianmacro-50">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 mx-auto text-indianmacro-400 mb-2" />
                    <p className="text-indianmacro-600">
                      TradingView market overview widget would be embedded here in the live version
                    </p>
                    <p className="text-sm text-indianmacro-500 mt-2">
                      Displaying real-time market data requires a TradingView widget or similar service
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Request for Data Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-indianmacro-800">
                Need Specific Economic Data?
              </h3>
              <p className="text-indianmacro-600 mt-2">
                Let us know what data or reports would be helpful for your research or analysis.
              </p>
            </div>
            
            <FeedbackForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
