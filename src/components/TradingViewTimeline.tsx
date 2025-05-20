
import { useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function TradingViewTimeline() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Clear existing widgets
    const widgetContainer = document.querySelector('.tradingview-widget-container__widget');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
    }

    // Create new widget
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      colorTheme: isDarkMode ? "dark" : "light",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: "550",
      locale: "en"
    });

    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && widgetContainer.contains(script)) {
        widgetContainer.removeChild(script);
      }
    };
  }, [isDarkMode]);

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
