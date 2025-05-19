
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface TradingViewChartProps {
  defaultSymbol?: string;
}

const TradingViewChart = ({ defaultSymbol = "NYSE:SPGI" }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Clean up any existing widgets
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Create a new widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: defaultSymbol,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: isDarkMode ? "dark" : "light",
          style: "1",
          locale: "en",
          toolbar_bg: isDarkMode ? "#2B2B43" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          height: 400,
        });
      }
    };
    
    document.head.appendChild(script);

    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [defaultSymbol, theme]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5 text-accent1" />
          Live Market Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          id="tradingview_widget_container"
          className="w-full h-[400px] rounded-md overflow-hidden"
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
