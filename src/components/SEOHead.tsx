
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: SEOHeadProps) => {
  // Construct the canonical URL
  const siteUrl = 'https://indianmacro.com';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
    </Helmet>
  );
};

export default SEOHead;
