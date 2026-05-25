
/**
 * Utility for updating meta tags throughout the application
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  type?: 'website' | 'article';
}

// Default values
const defaultConfig: MetaTagsConfig = {
  title: "IndianMacro - India's Premier Economic & Financial Data Platform",
  description: "Access comprehensive Indian economic data, financial research, and market insights. Discover in-depth analysis of Indian economy, markets, and financial trends.",
  url: "https://indianmacro.com",
  imageUrl: "https://indianmacro.com/og-image.jpg",
  type: "website"
};

/**
 * Updates the document's meta tags for SEO.
 *
 * NOTE: Per-route meta tags are now managed by <SEOHead /> via react-helmet-async,
 * which is the single source of truth for <title>, description, canonical and og:*.
 * This helper is kept as a no-op shim so legacy callers don't break and so we
 * don't duplicate / conflict with Helmet-managed head tags.
 */
export const updateMetaTags = (
  _title: string,
  _description: string,
  _path: string,
  _imageUrl?: string,
  _type: 'website' | 'article' = 'website'
): void => {
  // Intentionally empty — see note above.
};

/**
 * Restores the market ticker after theme changes
 * This helps prevent TradingView widget issues during theme toggling
 */
export const restoreMarketTicker = () => {
  try {
    const tickerIframe = document.getElementById('market-ticker-iframe') as HTMLIFrameElement;
    if (tickerIframe) {
      // Refresh the iframe by reloading its src
      const currentSrc = tickerIframe.src;
      tickerIframe.src = '';
      setTimeout(() => {
        tickerIframe.src = currentSrc;
      }, 50);
    }

    // Also refresh any tradingview widget containers
    const widgetContainers = document.querySelectorAll('.tradingview-widget-container__widget');
    if (widgetContainers.length > 0) {
      // Force widget reload by triggering a resize event
      window.dispatchEvent(new Event('resize'));
    }
  } catch (error) {
    console.error('Error restoring market ticker:', error);
  }
};

/**
 * Pre-defined meta tag configurations for main pages
 */
export const pageMetaTags = {
  home: {
    title: "IndianMacro | India's Macroeconomic Data & Research Platform",
    description: "In-depth research, data analysis, and expert insights on Indian economy, markets, and financial trends.",
    path: "/"
  },
  research: {
    title: "Economic Research & Analysis | IndianMacro",
    description: "Access our comprehensive research reports on Indian economy, financial markets, sectors, and policy impacts.",
    path: "/research"
  },
  dashboard: {
    title: "Economic Data Dashboard | IndianMacro",
    description: "Interactive visualizations of key Indian economic indicators, financial markets, and macroeconomic trends.",
    path: "/dashboard"
  },
  education: {
    title: "Economic Education & Resources | IndianMacro",
    description: "Learn about macroeconomics, financial markets, and economic concepts through our educational content.",
    path: "/education"
  },
  markets: {
    title: "Live Market Data & Analysis | IndianMacro",
    description: "Real-time market data, trends, and analysis for Indian and global financial markets.",
    path: "/markets"
  },
  about: {
    title: "About IndianMacro | Economic Research Platform",
    description: "Learn about our mission to provide accessible, insightful economic data and research on the Indian economy.",
    path: "/about"
  },
  contact: {
    title: "Contact IndianMacro | Get in Touch",
    description: "Contact our team for inquiries about our research, data services, or collaboration opportunities.",
    path: "/contact"
  }
};
