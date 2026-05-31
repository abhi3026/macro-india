import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import PageHero from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { categoryToSlug, educationalPostPath } from "@/utils/categorySlug";
import { postImage } from "@/utils/postImage";

const EducationCategoryPage = () => {
  const { category: categorySlug = "" } = useParams<{ category: string }>();

  const { data: category } = useQuery({
    queryKey: ["education-category", categorySlug],
    queryFn: () => fetchEducationCategory(categorySlug),
    enabled: !!categorySlug,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["educationalPosts"],
    queryFn: fetchMarketPosts,
  });

  const filtered = (posts ?? []).filter((p) => categoryToSlug(p.category) === categorySlug);
  const title = category?.title ?? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const intro = category?.intro_markdown ?? `Explore ${title} articles from the IndianMacro education library.`;

  const seoTitle = category?.seo_title || `${title} — Educational Resources | IndianMacro`;
  const seoDesc =
    category?.seo_description ||
    `Learn about ${title}: explainers, frameworks, and India-context insights from IndianMacro.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={`/education/${categorySlug}`}
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Education", url: "/education" },
          { name: title, url: `/education/${categorySlug}` },
        ]}
      />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <PageHero title={title} description={`${filtered.length} article${filtered.length === 1 ? "" : "s"} in ${title}`} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link to="/education" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Education
          </Link>
        </Button>

        <article className="prose dark:prose-invert max-w-none mb-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
        </article>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No published articles in this category yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((post) => {
              const blogPost = {
                id: post.id,
                title: post.title,
                excerpt: post.summary,
                date: new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                }),
                readTime: `${Math.max(3, Math.ceil((post.content?.split(/\s+/).length ?? 200) / 200))} min read`,
                author: { name: post.authorName || "Abhishek Gourav" },
                category: post.category ?? title,
                imageUrl: postImage(post.image, post.slug || post.id),
              };
              return (
                <Link key={post.id} to={educationalPostPath(post.category, post.slug)} className="h-full block">
                  <BlogPostCard post={blogPost} />
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EducationCategoryPage;
