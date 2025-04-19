
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
 * Updates the document's meta tags for SEO
 */
export const updateMetaTags = (
  title: string,
  description: string,
  path: string,
  imageUrl?: string,
  type: 'website' | 'article' = 'website'
): void => {
  const config: MetaTagsConfig = {
    title: title || defaultConfig.title,
    description: description || defaultConfig.description,
    url: `${defaultConfig.url}${path}`,
    imageUrl: imageUrl || defaultConfig.imageUrl,
    type: type || defaultConfig.type
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
 * Restores market ticker functionality after theme changes
 * This function helps fix any UI elements that might break during theme changes
 */
export const restoreMarketTicker = (): void => {
  // Find market ticker containers
  const tickerContainers = document.querySelectorAll('.market-ticker-container');
  
  // If there are ticker containers, they may need refreshing
  if (tickerContainers.length > 0) {
    // Force a small UI update by toggling a class
    tickerContainers.forEach(container => {
      // Add a temporary class
      container.classList.add('ticker-refreshing');
      
      // Remove it after a brief delay to trigger a repaint
      setTimeout(() => {
        container.classList.remove('ticker-refreshing');
      }, 50);
    });
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
