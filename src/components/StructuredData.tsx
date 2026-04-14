
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  type: 'Organization';
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  type: 'BreadcrumbList';
  items: BreadcrumbItem[];
}

interface DatasetSchemaProps {
  type: 'Dataset';
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  temporalCoverage?: string;
  spatialCoverage?: string;
}

interface ArticleSchemaProps {
  type: 'Article';
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  type: 'FAQPage';
  items: FAQItem[];
}

type StructuredDataProps =
  | OrganizationSchemaProps
  | BreadcrumbSchemaProps
  | DatasetSchemaProps
  | ArticleSchemaProps
  | FAQSchemaProps;

const SITE_URL = 'https://indianmacro.com';

const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IndianMacro',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: 'India\'s premier platform for macroeconomic data, financial research, and market insights.',
  sameAs: [
    'https://www.linkedin.com/company/indian-macro',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@indianmacro.com',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: 'English',
  },
});

const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

const buildDatasetSchema = (props: DatasetSchemaProps) => ({
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: props.name,
  description: props.description,
  url: `${SITE_URL}${props.url}`,
  keywords: props.keywords || [],
  creator: {
    '@type': 'Organization',
    name: 'IndianMacro',
    url: SITE_URL,
  },
  ...(props.temporalCoverage && { temporalCoverage: props.temporalCoverage }),
  ...(props.spatialCoverage && { spatialCoverage: props.spatialCoverage }),
  license: 'https://creativecommons.org/licenses/by/4.0/',
});

const buildArticleSchema = (props: ArticleSchemaProps) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: props.headline,
  description: props.description,
  url: `${SITE_URL}${props.url}`,
  ...(props.datePublished && { datePublished: props.datePublished }),
  ...(props.dateModified && { dateModified: props.dateModified }),
  author: {
    '@type': 'Organization',
    name: props.authorName || 'IndianMacro',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'IndianMacro',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.svg`,
    },
  },
  ...(props.imageUrl && {
    image: {
      '@type': 'ImageObject',
      url: props.imageUrl,
    },
  }),
});

const buildFAQSchema = (items: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

const StructuredData = (props: StructuredDataProps) => {
  let schema: object;

  switch (props.type) {
    case 'Organization':
      schema = buildOrganizationSchema();
      break;
    case 'BreadcrumbList':
      schema = buildBreadcrumbSchema(props.items);
      break;
    case 'Dataset':
      schema = buildDatasetSchema(props);
      break;
    case 'Article':
      schema = buildArticleSchema(props);
      break;
    case 'FAQPage':
      schema = buildFAQSchema(props.items);
      break;
    default:
      return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
