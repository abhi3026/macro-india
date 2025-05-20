
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import { loadTradingViewScript } from "@/utils/tradingViewLoader";

interface TradingViewNewsWidgetProps {
  title?: string;
}

const TradingViewNewsWidget = ({ title = "Market News" }: TradingViewNewsWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Determine the appropriate theme for the widget
  const widgetTheme = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) 
    ? "dark" 
    : "light";

  useEffect(() => {
    if (!containerRef.current) return;
    
    const widgetContainer = containerRef.current.querySelector(".tradingview-widget-container__widget");
    if (widgetContainer) {
      containerRef.current.removeChild(widgetContainer);
    }
    
    // Create the widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "colorTheme": widgetTheme,
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": 500,
      "locale": "en"
    });
    
    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget";
    
    if (containerRef.current) {
      containerRef.current.appendChild(container);
      container.appendChild(script);
    }
    
    return () => {
      if (containerRef.current && container) {
        try {
          containerRef.current.removeChild(container);
        } catch (error) {
          console.error("Error removing TradingView widget:", error);
        }
      }
    };
  }, [widgetTheme]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-w-full">
        <div 
          ref={containerRef}
          className="tradingview-widget-container w-full overflow-hidden"
          style={{ height: "500px" }}
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewNewsWidget;
