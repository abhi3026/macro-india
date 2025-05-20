
/**
 * Utility for updating meta tags throughout the application
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

// Default values
const defaultConfig: MetaTagsConfig = {
  title: "IndianMacro - India's Premier Economic & Financial Data Platform",
  description: "Access comprehensive Indian economic data, financial research, and market insights. Discover in-depth analysis of Indian economy, markets, and financial trends.",
  url: "https://indianmacro.com",
  imageUrl: "https://indianmacro.com/og-image.jpg",
  type: "website",
  keywords: "indian economy, financial data, economic research, market insights, india"
};

/**
 * Updates the document's meta tags for SEO
 */
export const updateMetaTags = (
  title: string,
  description: string,
  path: string,
  imageUrl?: string,
  type: 'website' | 'article' = 'website',
  keywords?: string
): void => {
  const config: MetaTagsConfig = {
    title: title || defaultConfig.title,
    description: description || defaultConfig.description,
    url: `${defaultConfig.url}${path}`,
    imageUrl: imageUrl || defaultConfig.imageUrl,
    type: type || defaultConfig.type,
    keywords: keywords || defaultConfig.keywords
  };

  // Basic meta tags
  document.title = config.title;
  
  // Find and update meta description, or create if it doesn't exist
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', config.description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', config.description);
    document.head.appendChild(metaDescription);
  }
  
  // Add keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', config.keywords || '');
  } else {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', config.keywords || '');
    document.head.appendChild(metaKeywords);
  }

  // Update OG tags
  updateOrCreateMeta('property', 'og:title', config.title);
  updateOrCreateMeta('property', 'og:description', config.description);
  updateOrCreateMeta('property', 'og:url', config.url);
  updateOrCreateMeta('property', 'og:image', config.imageUrl);
  updateOrCreateMeta('property', 'og:type', config.type);
  
  // Update Twitter tags
  updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  updateOrCreateMeta('name', 'twitter:title', config.title);
  updateOrCreateMeta('name', 'twitter:description', config.description);
  updateOrCreateMeta('name', 'twitter:image', config.imageUrl);
};

/**
 * Helper function to update or create meta tags
 */
const updateOrCreateMeta = (
  attributeName: string, 
  attributeValue: string, 
  content: string
): void => {
  let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
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
    path: "/",
    keywords: "indian economy, financial data, economic research, market insights, india"
  },
  research: {
    title: "Economic Research & Analysis | IndianMacro",
    description: "Access our comprehensive research reports on Indian economy, financial markets, sectors, and policy impacts.",
    path: "/research",
    keywords: "research, Indian economy, macro insights, stock market analysis, policy impact"
  },
  dashboard: {
    title: "Economic Data Dashboard | IndianMacro",
    description: "Interactive visualizations of key Indian economic indicators, financial markets, and macroeconomic trends.",
    path: "/dashboard",
    keywords: "data dashboard, economic indicators, financial markets, data visualization, Indian economy"
  },
  education: {
    title: "Economic Education & Resources | IndianMacro",
    description: "Learn about macroeconomics, financial markets, and economic concepts through our educational content.",
    path: "/education",
    keywords: "economic education, financial literacy, macroeconomics, investing, markets"
  },
  markets: {
    title: "Live Market Data & Analysis | IndianMacro",
    description: "Real-time market data, trends, and analysis for Indian and global financial markets.",
    path: "/markets",
    keywords: "live markets, stock market, nifty, sensex, commodities, forex, analysis"
  },
  indicators: {
    title: "Economic Indicators | IndianMacro",
    description: "Track key economic indicators of the Indian economy including GDP, inflation, industrial production, and more.",
    path: "/economic-indicators",
    keywords: "economic indicators, GDP, inflation, IIP, unemployment, Indian economy"
  },
  rates: {
    title: "Interest Rates & Bonds | IndianMacro",
    description: "Monitor interest rates, bond yields, and central bank policies affecting the Indian economy.",
    path: "/interest-rates",
    keywords: "interest rates, RBI, bonds, yield curve, monetary policy, debt markets"
  },
  about: {
    title: "About IndianMacro | Economic Research Platform",
    description: "Learn about our mission to provide accessible, insightful economic data and research on the Indian economy.",
    path: "/about",
    keywords: "about us, Indian economy, research platform, economic data, mission"
  },
  contact: {
    title: "Contact IndianMacro | Get in Touch",
    description: "Contact our team for inquiries about our research, data services, or collaboration opportunities.",
    path: "/contact",
    keywords: "contact, feedback, inquiries, collaboration, support"
  },
  privacy: {
    title: "Privacy Policy | IndianMacro",
    description: "Our privacy policy detailing how we handle and protect your personal information.",
    path: "/privacy",
    keywords: "privacy policy, data protection, user privacy, personal information"
  },
  terms: {
    title: "Terms of Service | IndianMacro",
    description: "Terms and conditions for using the IndianMacro platform and services.",
    path: "/terms",
    keywords: "terms of service, conditions, legal, user agreement"
  }
};
