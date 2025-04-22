import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const EconomicCalendar = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "regular",
      "width": "100%",
      "height": "400",
      "locale": "en",
      "importanceFilter": "-1,0,1",
      "countryFilter": "in,us,cn,jp,eu"
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <Card className="shadow-sm w-full">
      <CardContent className="p-0 overflow-hidden">
        <div 
          ref={containerRef}
          className="tradingview-widget-container w-full" 
          style={{ height: "400px" }}
        >
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
              <span className="blue-text">Track all markets on TradingView</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicCalendar;
