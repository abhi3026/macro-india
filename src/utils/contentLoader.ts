/**
 * Content loader — backed by Lovable Cloud (Supabase).
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
  showOnHomepage?: boolean;
  authorName?: string;
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
  showOnHomepage?: boolean;
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
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
    showOnHomepage: !!r.show_on_homepage,
    authorName: r.author_name ?? undefined,
    content: r.body ?? "",
    slug: r.slug,
  }));
}

export async function fetchMarketPosts(): Promise<MarketPost[]> {
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
    showOnHomepage: !!r.show_on_homepage,
    authorName: r.author_name ?? undefined,
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
  const d: any = data;
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    content: d.body ?? "",
    summary: d.excerpt ?? "",
    date: d.published_at ?? d.created_at,
    category: d.category ?? undefined,
    image: d.image ?? undefined,
    showOnHomepage: !!d.show_on_homepage,
    authorName: d.author_name ?? undefined,
    seoTitle: d.seo_title ?? undefined,
    seoDescription: d.seo_description ?? undefined,
    ogImage: d.og_image ?? undefined,
    canonicalUrl: d.canonical_url ?? undefined,
    publishedAt: d.published_at ?? undefined,
    updatedAt: d.updated_at ?? undefined,
  };
}

export interface EducationCategory {
  slug: string;
  title: string;
  intro_markdown: string;
  display_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
}

export async function fetchEducationCategories(): Promise<EducationCategory[]> {
  const { data, error } = await supabase
    .from("education_categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error || !data) return [];
  return data as any;
}

export async function fetchEducationCategory(slug: string): Promise<EducationCategory | null> {
  const { data, error } = await supabase
    .from("education_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as any;
}
