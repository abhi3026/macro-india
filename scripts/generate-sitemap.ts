// Generates public/sitemap.xml from static routes plus published Supabase content.
// Runs via predev/prebuild hooks.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.indianmacro.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://nhnazpsymubixvdymitu.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obmF6cHN5bXViaXh2ZHltaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjAyNjMsImV4cCI6MjA5NDA5NjI2M30.IAYgJWtUwDLcbilIFR3h72yPEqye_9O6ERa37e6gi5A";

function categoryToSlug(category?: string | null): string {
  if (!category) return "general";
  return (
    category.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) ||
    "general"
  );
}

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/research", changefreq: "weekly", priority: "0.9" },
  { path: "/data-dashboard", changefreq: "daily", priority: "0.9" },
  { path: "/data-dashboard/economic-indicators", changefreq: "daily", priority: "0.9" },
  { path: "/data-dashboard/interest-rates-bonds", changefreq: "daily", priority: "0.8" },
  { path: "/education", changefreq: "weekly", priority: "0.8" },
  { path: "/news", changefreq: "hourly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

function renderSitemap(entries: Entry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

async function main() {
  const entries: Entry[] = [...staticEntries];

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    const [{ data: edu }, { data: research }, { data: cats }] = await Promise.all([
      sb.from("educational_posts").select("slug,category,updated_at").eq("status", "published"),
      sb.from("research_articles").select("slug,updated_at").eq("status", "published"),
      sb.from("education_categories").select("slug,updated_at"),
    ]);

    const categorySlugs = new Set<string>();
    (cats ?? []).forEach((c: any) => categorySlugs.add(c.slug));
    (edu ?? []).forEach((p: any) => categorySlugs.add(categoryToSlug(p.category)));

    categorySlugs.forEach((s) =>
      entries.push({ path: `/education/${s}`, changefreq: "weekly", priority: "0.7" })
    );

    (edu ?? []).forEach((p: any) =>
      entries.push({
        path: `/education/${categoryToSlug(p.category)}/${p.slug}`,
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : undefined,
        changefreq: "monthly",
        priority: "0.7",
      })
    );

    (research ?? []).forEach((r: any) =>
      entries.push({
        path: `/research/${r.slug}`,
        lastmod: r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : undefined,
        changefreq: "monthly",
        priority: "0.8",
      })
    );
  } catch (e) {
    console.warn("sitemap: failed to fetch dynamic entries, writing static only:", e);
  }

  writeFileSync(resolve("public/sitemap.xml"), renderSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
