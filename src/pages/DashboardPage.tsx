import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import DataWidget, { DataWidgetProps } from "@/components/DataWidget";
import FeedbackForm from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Activity, RefreshCw, ArrowUpRight, TrendingUp, TrendingDown, Landmark, Building2, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const economicIndicators: DataWidgetProps[] = [
  { title: "GDP Growth Rate", description: "Quarterly GDP growth (YoY)", chartType: "area",
    data: { labels: ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25"], datasets: [{ label: "GDP Growth (%)", data: [6.1,6.3,6.7,6.9,7.2], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.2)", fill: true }] },
    latestValue: "7.2%", latestDate: "Q1 2025", trend: "up" },
  { title: "Inflation Rate (CPI)", description: "Monthly inflation data", chartType: "bar",
    data: { labels: ["Nov","Dec","Jan","Feb","Mar","Apr"], datasets: [{ label: "Inflation Rate (%)", data: [5.7,5.5,5.1,4.9,4.7,4.5], borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.5)" }] },
    latestValue: "4.5%", latestDate: "April 2025", trend: "down" },
  { title: "Unemployment Rate", description: "Monthly unemployment data", chartType: "area",
    data: { labels: ["Nov","Dec","Jan","Feb","Mar","Apr"], datasets: [{ label: "Unemployment (%)", data: [7.1,7.3,7.2,7.0,6.8,6.6], borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.2)", fill: true }] },
    latestValue: "6.6%", latestDate: "April 2025", trend: "down" },
  { title: "Foreign Exchange Reserves", description: "Weekly forex reserves (USD Bn)", chartType: "area",
    data: { labels: ["Feb 25","Mar 3","Mar 10","Mar 17","Mar 24","Mar 31","Apr 7"], datasets: [{ label: "Forex Reserves", data: [619.2,623.5,625.6,628.4,630.1,631.5,635.8], borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)", fill: true }] },
    latestValue: "$635.8B", latestDate: "Apr 7, 2025", trend: "up" },
];

const financialMarkets: DataWidgetProps[] = [
  { title: "NIFTY 50", description: "Daily closing values", chartType: "area",
    data: { labels: ["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 8","Apr 9"], datasets: [{ label: "NIFTY 50", data: [21430,21595,21682,21720,21567,21440,21651], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.2)", fill: true }] },
    latestValue: "21,651.15", latestDate: "Apr 9, 2025", trend: "up" },
  { title: "USD/INR Exchange Rate", description: "Daily exchange rate", chartType: "area",
    data: { labels: ["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 8","Apr 9"], datasets: [{ label: "USD/INR", data: [83.15,83.25,83.31,83.40,83.28,83.22,83.02], borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.2)", fill: true }] },
    latestValue: "₹83.02", latestDate: "Apr 9, 2025", trend: "down" },
  { title: "10-Year G-Sec Yield", description: "Daily yield (%)", chartType: "area",
    data: { labels: ["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 8","Apr 9"], datasets: [{ label: "10Y Yield", data: [7.05,7.08,7.12,7.15,7.18,7.16,7.14], borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.2)", fill: true }] },
    latestValue: "7.14%", latestDate: "Apr 9, 2025", trend: "down" },
  { title: "BSE Bankex", description: "Banking sector index", chartType: "area",
    data: { labels: ["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 8","Apr 9"], datasets: [{ label: "BSE Bankex", data: [49620,49850,50120,50380,50140,49980,50210], borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)", fill: true }] },
    latestValue: "50,210.32", latestDate: "Apr 9, 2025", trend: "up" },
];

type Kpi = { label: string; value: string; delta: string; trend: "up" | "down"; series: number[] };
const kpis: Kpi[] = [
  { label: "GDP YoY", value: "7.2%", delta: "+0.3pp", trend: "up", series: [6.1,6.3,6.7,6.9,7.2] },
  { label: "CPI Inflation", value: "4.5%", delta: "-0.2pp", trend: "down", series: [5.7,5.5,5.1,4.9,4.7,4.5] },
  { label: "Repo Rate", value: "6.50%", delta: "Hold", trend: "up", series: [6.5,6.5,6.5,6.5,6.5,6.5] },
  { label: "NIFTY 50", value: "21,651", delta: "+0.97%", trend: "up", series: [21430,21595,21682,21720,21567,21440,21651] },
];

function Spark({ data, trend }: { data: number[]; trend: "up" | "down" }) {
  const w = 100, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const color = trend === "up" ? "hsl(var(--gain))" : "hsl(var(--loss))";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
    </svg>
  );
}

const sources = [
  { name: "RBI", desc: "Monetary & financial statistics", href: "https://www.rbi.org.in/", icon: Landmark },
  { name: "MOSPI", desc: "Government statistical data", href: "https://www.mospi.gov.in/", icon: Building2 },
  { name: "NSE", desc: "Stock market data & indices", href: "https://www.nseindia.com/", icon: LineChart },
];

const DashboardPage = () => {
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const updatedLabel = useMemo(() => updatedAt.toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short",
  }), [updatedAt]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <PageHero
        eyebrow="Live Data · India"
        title="Macro & Markets Dashboard"
        description="Real-time visualisation of the indicators that move India's economy and capital markets."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Dashboard" }]}
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {kpis.map((k) => (
              <div key={k.label} className="surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] tracking-wider uppercase text-muted-foreground">{k.label}</p>
                  {k.trend === "up"
                    ? <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--gain))]" />
                    : <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--loss))]" />}
                </div>
                <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">{k.value}</p>
                <p className={`text-xs tabular-nums ${k.trend === "up" ? "text-[hsl(var(--gain))]" : "text-[hsl(var(--loss))]"}`}>{k.delta}</p>
                <div className="mt-2"><Spark data={k.series} trend={k.trend} /></div>
              </div>
            ))}
          </div>

          {/* Refresh bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="text-xs text-muted-foreground">
              Updated <span className="font-mono tabular-nums text-foreground">{updatedLabel}</span> IST
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setUpdatedAt(new Date())}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
          </div>

          <Tabs defaultValue="economic">
            <TabsList className="bg-muted/60">
              <TabsTrigger value="economic" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Economic Indicators
              </TabsTrigger>
              <TabsTrigger value="markets" className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Financial Markets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="economic" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {economicIndicators.map((w, i) => (
                  <div key={i} className="surface p-1">
                    <DataWidget {...w} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="markets" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {financialMarkets.map((w, i) => (
                  <div key={i} className="surface p-1">
                    <DataWidget {...w} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Source cards */}
          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold mb-4">External data sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sources.map(({ name, desc, href, icon: Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  className="surface p-5 group hover:border-[hsl(var(--brand))]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[hsl(var(--brand))]" />
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="mt-3 font-display text-base font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">Need a specific dataset?</h2>
              <p className="text-muted-foreground mt-1.5">Tell us what you need — we'll source it.</p>
            </div>
            <FeedbackForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
