import { useEffect } from "react";
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
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Asia/Kolkata",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    const container = document.querySelector('.tradingview-widget-container__widget');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
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
        <div className="tradingview-widget-container" style={{ height: `${height}px` }}>
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
              <span className="blue-text">Track all markets on TradingView</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
