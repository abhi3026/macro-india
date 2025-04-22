let scriptPromise: Promise<void> | null = null;
let scriptLoaded = false;

export function loadTradingViewScript(): Promise<void> {
  if (scriptLoaded) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    try {
      // If script is already loaded, resolve immediately
      if (window.TradingView) {
        scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/tv.js';

      script.onload = () => {
        scriptLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        scriptPromise = null;
        scriptLoaded = false;
        reject(new Error('Failed to load TradingView script'));
      };

      document.head.appendChild(script);
    } catch (error) {
      scriptPromise = null;
      scriptLoaded = false;
      reject(error);
    }
  });

  return scriptPromise;
}

// Add TypeScript type definition for TradingView
declare global {
  interface Window {
    TradingView: any;
  }
} 