import { useEffect } from 'react';

export default function TradingViewNewsWidget() {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    
    // Create a script element for the configuration
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.textContent = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: 400,
      colorTheme: "light",
      locale: "en"
    });
    
    // Find the container
    const container = document.querySelector('.tradingview-widget-container__widget');
    if (container) {
      container.appendChild(configScript);
      container.appendChild(script);
    }
    
    // Cleanup
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full">
      <div className="tradingview-widget-container__widget w-full"></div>
    </div>
  );
} 