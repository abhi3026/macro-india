/**
 * Content loader — backed by Lovable Cloud (Supabase).
 * Public consumers: ResearchPage, EducationPage, FeaturedResearch, etc.
 */
import { supabase } from "@/integrations/supabase/client";

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
  slug: string;
  content: string;
  summary: string;
  date: string;
  category?: string;
  image?: string;
  imageCaption?: string;
  featured?: boolean;
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

export async function fetchResearchPosts(): Promise<ResearchPost[]> {
  const { data, error } = await supabase
    .from("research_articles")
    .select("*")
    .eq("status", "published")
    .order("publish_date", { ascending: false });
  if (error || !data) return [];
  return data.map((r: any) => ({
    id: r.id,
    title: r.title,
    date: r.publish_date ?? r.published_at ?? r.created_at,
    description: r.excerpt ?? "",
    category: r.category ?? "Research",
    image: r.featured_image ?? "",
    file: undefined,
    premium: false,
    featured: !!r.featured,
    content: r.body ?? "",
    slug: r.slug,
  }));
}

export async function fetchMarketPosts(): Promise<MarketPost[]> {
  // Educational posts power the public Education page (kept under MarketPost shape for compatibility)
  const { data, error } = await supabase
    .from("educational_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r: any) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    content: r.body ?? "",
    summary: r.excerpt ?? "",
    date: r.published_at ?? r.created_at,
    category: r.category ?? undefined,
    image: r.image ?? undefined,
    featured: false,
  }));
}

export async function fetchNewsletterPosts(): Promise<NewsletterPost[]> {
  return [];
}

export async function fetchMarketPost(slug: string): Promise<MarketPost | null> {
  const { data, error } = await supabase
    .from("educational_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: (data as any).id,
    title: (data as any).title,
    slug: (data as any).slug,
    content: (data as any).body ?? "",
    summary: (data as any).excerpt ?? "",
    date: (data as any).published_at ?? (data as any).created_at,
    category: (data as any).category ?? undefined,
    image: (data as any).image ?? undefined,
  };
}
