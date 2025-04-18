
/**
 * Updates document meta tags for SEO
 */
export const updateMetaTags = (
  title: string,
  description: string,
  path: string = ""
) => {
  // Update basic meta tags
  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }
  
  // Update Open Graph / Facebook
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  if (ogTitle) ogTitle.setAttribute("content", title);
  if (ogDescription) ogDescription.setAttribute("content", description);
  if (ogUrl) ogUrl.setAttribute("content", `https://indianmacro.com${path}`);
  
  // Update Twitter
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  
  if (twitterTitle) twitterTitle.setAttribute("content", title);
  if (twitterDescription) twitterDescription.setAttribute("content", description);
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `https://indianmacro.com${path}`);
};

/**
 * Restores market ticker functionality after theme changes
 * This ensures that the market ticker continues working properly across dark/light mode transitions
 */
export const restoreMarketTicker = () => {
  try {
    // Find all market ticker containers
    const tickerContainers = document.querySelectorAll('.ticker-container');
    
    if (tickerContainers.length === 0) return;
    
    // For each container, restore animation state
    tickerContainers.forEach(container => {
      const marqueeElements = container.querySelectorAll('.animate-marquee, .animate-marquee2');
      
      // Reset animation by briefly removing and re-adding the classes
      marqueeElements.forEach(element => {
        const classList = [...element.classList];
        const hasMarquee = classList.includes('animate-marquee');
        const hasMarquee2 = classList.includes('animate-marquee2');
        
        // Store original position and reapply animation with slight delay to reset
        if (hasMarquee) {
          element.classList.remove('animate-marquee');
          requestAnimationFrame(() => element.classList.add('animate-marquee'));
        }
        
        if (hasMarquee2) {
          element.classList.remove('animate-marquee2');
          requestAnimationFrame(() => element.classList.add('animate-marquee2'));
        }
      });
    });
  } catch (error) {
    console.error("Error restoring market ticker:", error);
  }
};
