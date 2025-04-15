
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
