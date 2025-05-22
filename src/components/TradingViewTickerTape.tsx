
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const TradingViewTickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Clear any existing widgets
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Create the widget container div
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    
    // Create the copyright div
    const copyrightDiv = document.createElement("div");
    copyrightDiv.className = "tradingview-widget-copyright";
    const copyrightLink = document.createElement("a");
    copyrightLink.href = "https://www.tradingview.com/";
    copyrightLink.rel = "noopener nofollow";
    copyrightLink.target = "_blank";
    const spanElement = document.createElement("span");
    spanElement.className = "blue-text";
    spanElement.textContent = "Track all markets on TradingView";
    copyrightLink.appendChild(spanElement);
    copyrightDiv.appendChild(copyrightLink);
    
    // Create the script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "description": "Nifty 50",
          "proName": "NSE:NIFTY"
        },
        {
          "description": "Banknifty",
          "proName": "NSE:BANKNIFTY"
        },
        {
          "description": "Sensex",
          "proName": "BSE:SENSEX"
        },
        {
          "description": "S&P 500",
          "proName": "SP:SPX"
        },
        {
          "description": "Dow Jones",
          "proName": "TVC:DJI"
        },
        {
          "description": "FTSE 100",
          "proName": "SPREADEX:FTSE"
        },
        {
          "description": "SSE",
          "proName": "SSE:000888"
        },
        {
          "description": "Nikkie",
          "proName": "INDEX:NTH"
        },
        {
          "description": "CAC 40",
          "proName": "TVC:CAC40"
        },
        {
          "description": "DAX",
          "proName": "XETR:DAX"
        },
        {
          "description": "IBOVESPA",
          "proName": "INDEX:IBOV"
        },
        {
          "description": "BTC",
          "proName": "CRYPTO:BTCUSD"
        },
        {
          "description": "ETH",
          "proName": "CRYPTO:ETHUSD"
        },
        {
          "description": "BNB",
          "proName": "CRYPTO:BNBUSD"
        },
        {
          "description": "SOLANA",
          "proName": "CRYPTO:SOLUSD"
        },
        {
          "description": "XRP",
          "proName": "CRYPTO:XRPUSD"
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": false,
      "largeChartUrl": "https://www.indianmacro.com/data-dashboard/markets",
      "displayMode": "adaptive",
      "colorTheme": isDarkMode ? "dark" : "light",
      "locale": "en"
    });

    // Append elements to the DOM
    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer);
      containerRef.current.appendChild(copyrightDiv);
      containerRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <div className="w-full py-1 bg-background">
      <div
        ref={containerRef}
        className="tradingview-widget-container"
      />
    </div>
  );
};

export default TradingViewTickerTape;
