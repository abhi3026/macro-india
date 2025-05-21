
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card } from "@/components/ui/card";

const TradingViewTickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Clear any existing widgets
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Create the widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    
    // Create the script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "Nifty 50"
        },
        {
          "proName": "BSE:SENSEX",
          "title": "Sensex"
        },
        {
          "description": "USD/INR",
          "proName": "OANDA:USDINR"
        },
        {
          "description": "BTC/USD",
          "proName": "BITSTAMP:BTCUSD"
        },
        {
          "description": "Gold",
          "proName": "OANDA:XAUUSD"
        },
        {
          "description": "Crude Oil",
          "proName": "NYMEX:CL1!"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": isDarkMode ? "dark" : "light",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    // Append elements to the DOM
    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer);
      widgetContainer.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        const widgetContainer = containerRef.current.querySelector(".tradingview-widget-container__widget");
        if (widgetContainer) {
          containerRef.current.removeChild(widgetContainer);
        }
      }
    };
  }, [theme]);

  return (
    <div className="w-full border-y border-border bg-background py-1">
      <div
        ref={containerRef}
        className="tradingview-widget-container"
      />
    </div>
  );
};

export default TradingViewTickerTape;
