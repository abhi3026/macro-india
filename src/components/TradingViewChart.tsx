
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";

interface TradingViewChartProps {
  symbol?: string;
  height?: number;
}

const TradingViewChart = ({
  symbol = "NSE:NIFTY",
  height = 600
}: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": symbol,
          "interval": "D",
          "timezone": "Asia/Kolkata",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "withdateranges": true,
          "range": "YTD",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": true,
          "studies": [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ],
          "container_id": container.id,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          // Advanced chart options
          "enabled_features": [
            "study_templates",
            "use_localstorage_for_settings"
          ],
          "charts_storage_url": "https://saveload.tradingview.com",
          "charts_storage_api_version": "1.1",
          "client_id": "tradingview.com",
          "fullscreen": false,
          "hide_top_toolbar": false,
          "save_image": true,
          "watchlist": [
            "NSE:NIFTY",
            "NSE:BANKNIFTY",
            "NSE:SENSEX",
            "BSE:SENSEX",
            "NSE:FINNIFTY",
            "NSE:NIFTYMID50",
            "NSE:INDIAVIX"
          ]
        });
      }
    };

    document.head.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

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
