import { useEffect } from 'react';

export default function TradingViewTimeline() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "feedMode": "all_symbols",
        "colorTheme": "light",
        "isTransparent": false,
        "displayMode": "regular",
        "width": "100%",
        "height": "550",
        "locale": "en"
      }
    `;

    const widgetContainer = document.querySelector('.tradingview-widget-container__widget');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && widgetContainer.contains(script)) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
      <div className="text-center mt-4">
        <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">
          <span className="text-blue-500">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
} 