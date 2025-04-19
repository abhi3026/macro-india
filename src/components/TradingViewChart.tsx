
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: number;
}

const TradingViewChart = ({
  symbol = "NSE:NIFTY",
  interval = "D",
  theme = "light",
  height = 400
}: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing script
    const container = containerRef.current;
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Create a new script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined" && container) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          container_id: container.id,
          hide_side_toolbar: false,
          save_image: true,
          studies: ["RSI@tv-basicstudies", "MAExp@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
        });
      }
    };

    // Append script to document
    document.head.appendChild(script);

    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme]);

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
          id="tradingview_widget" 
          className="w-full transition-all"
          style={{ height }}
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;

// Add TypeScript type definition for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: any;
    };
  }
}
