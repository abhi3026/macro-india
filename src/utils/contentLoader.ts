
/**
 * Content loader utility for fetching CMS content
 */

import { toast } from "@/components/ui/use-toast";

export type ContentType = 'research' | 'market' | 'newsletter';

export interface ResearchPost {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  image: string;
  file?: string;
  premium: boolean;
  featured: boolean;
  content: string;
  slug: string;
}

export interface MarketPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
  category: string;
  featured: boolean;
  content: string;
  slug: string;
}

export interface NewsletterPost {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  send: boolean;
  content: string;
  slug: string;
}

// Function to fetch research posts
export async function fetchResearchPosts(): Promise<ResearchPost[]> {
  try {
    // In production, we would fetch from the actual CMS API
    // For development, we'll use a mock implementation
    
    // Simulated API call to fetch content from /content/research
    const response = await fetch('/api/content/research');
    
    if (!response.ok) {
      throw new Error('Failed to fetch research posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching research posts:', error);
    toast({
      title: "Error loading research content",
      description: "Please try again later",
      variant: "destructive",
    });
    
    // Return sample data as fallback
    return getSampleResearchPosts();
  }
}

// Function to fetch market posts
export async function fetchMarketPosts(): Promise<MarketPost[]> {
  try {
    // Simulated API call to fetch content from /content/market
    const response = await fetch('/api/content/market');
    
    if (!response.ok) {
      throw new Error('Failed to fetch market posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching market posts:', error);
    toast({
      title: "Error loading market insights",
      description: "Please try again later",
      variant: "destructive",
    });
    
    // Return sample data as fallback
    return getSampleMarketPosts();
  }
}

// Function to fetch newsletter posts
export async function fetchNewsletterPosts(): Promise<NewsletterPost[]> {
  try {
    // Simulated API call to fetch content from /content/newsletter
    const response = await fetch('/api/content/newsletter');
    
    if (!response.ok) {
      throw new Error('Failed to fetch newsletter posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching newsletter posts:', error);
    toast({
      title: "Error loading newsletter content",
      description: "Please try again later",
      variant: "destructive",
    });
    
    // Return sample data as fallback
    return getSampleNewsletterPosts();
  }
}

// Sample data functions (for fallbacks/development)
function getSampleResearchPosts(): ResearchPost[] {
  return [
    {
      id: "1",
      title: "Indian Economic Outlook 2025",
      description: "Comprehensive analysis of India's economic trajectory for the coming year with key indicators and growth projections.",
      date: "2025-04-02",
      category: "Economic Outlook",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      file: "#",
      premium: false,
      featured: true,
      content: "# Indian Economic Outlook 2025\n\nIndia's economy is projected to grow at 7.2% in the fiscal year 2025-26, maintaining its position as one of the fastest-growing major economies globally...",
      slug: "indian-economic-outlook-2025"
    },
    {
      id: "2",
      title: "Impact of Monetary Policy on Indian Markets",
      description: "Analysis of how RBI's latest monetary policy decisions are affecting various sectors of the Indian economy.",
      date: "2025-03-28",
      category: "Monetary Policy",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      file: "#",
      premium: false,
      featured: false,
      content: "# Impact of Monetary Policy on Indian Markets\n\nThe Reserve Bank of India's recent decision to hold rates steady has had varied impacts across different sectors...",
      slug: "impact-of-monetary-policy-on-indian-markets"
    },
    {
      id: "3",
      title: "Agricultural Trends & Food Security",
      description: "Examination of current agricultural output, challenges, and implications for India's food security.",
      date: "2025-03-20",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1589256479193-9ff1356bed98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
      file: "#",
      premium: false,
      featured: false,
      content: "# Agricultural Trends & Food Security\n\nIndia's agricultural sector faces multiple challenges in 2025, including climate change impacts and water scarcity issues...",
      slug: "agricultural-trends-food-security"
    }
  ];
}

function getSampleMarketPosts(): MarketPost[] {
  return [
    {
      id: "1",
      title: "Q1 2025 Equity Market Review",
      summary: "Analysis of Indian equity market performance in the first quarter of 2025.",
      date: "2025-04-05",
      category: "Equities",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      content: "# Q1 2025 Equity Market Review\n\nIndian equity markets showed remarkable resilience in Q1 2025, with the Nifty 50 gaining 7.3% despite global headwinds...",
      slug: "q1-2025-equity-market-review"
    },
    {
      id: "2",
      title: "Bond Market Outlook April 2025",
      summary: "Current trends and future outlook for Indian government and corporate bonds.",
      date: "2025-04-03",
      category: "Debt",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      featured: false,
      content: "# Bond Market Outlook April 2025\n\nYields on 10-year government securities have stabilized around 7.1% following the RBI's policy decision to maintain status quo on rates...",
      slug: "bond-market-outlook-april-2025"
    }
  ];
}

function getSampleNewsletterPosts(): NewsletterPost[] {
  return [
    {
      id: "1",
      title: "April 2025 Economic Roundup",
      description: "Monthly summary of key economic indicators and market movements.",
      date: "2025-04-10",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      send: true,
      content: "# April 2025 Economic Roundup\n\nDear Subscribers,\n\nThis month saw significant developments in the Indian economy, with inflation moderating to 4.5% and manufacturing PMI reaching a two-year high...",
      slug: "april-2025-economic-roundup"
    },
    {
      id: "2",
      title: "Special Report: Budget Impact Analysis",
      description: "Detailed assessment of the Union Budget's implications for various sectors.",
      date: "2025-03-15",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      send: true,
      content: "# Special Report: Budget Impact Analysis\n\nDear Subscribers,\n\nThe recently announced Union Budget 2025-26 includes several key measures that will impact various sectors of the economy...",
      slug: "budget-impact-analysis"
    }
  ];
}
