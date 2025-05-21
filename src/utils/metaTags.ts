/**
 * Utility functions for updating meta tags dynamically.
 */

/**
 * Updates meta tags in the document head.
 * @param title The title for the meta tag.
 * @param description The description for the meta tag.
 * @param canonicalUrl The canonical URL for the page.
 */
export const updateMetaTags = (title: string, description: string, canonicalUrl: string): void => {
  document.title = title;

  // Update or create meta description tag
  let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description;

  // Update or create canonical URL link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = `${window.location.origin}${canonicalUrl}`;
};

/**
 * Function to restore market ticker when theme changes
 */
export const restoreMarketTicker = (): void => {
  // Get all TradingView containers
  const containers = document.querySelectorAll('.tradingview-widget-container');
  
  if (!containers || containers.length === 0) return;
  
  // For each container, try to refresh the widget
  containers.forEach(container => {
    const widget = container.querySelector('.tradingview-widget-container__widget');
    if (widget && widget.innerHTML.trim() === '') {
      // If empty, force a refresh of the parent component
      const event = new Event('tradingview-refresh');
      document.dispatchEvent(event);
    }
  });
};
