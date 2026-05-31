import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Tag, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarketPost, fetchMarketPosts } from "@/utils/contentLoader";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { categoryToSlug, educationalPostPath, educationCategoryPath } from "@/utils/categorySlug";
import { postImage } from "@/utils/postImage";

// Slugify header text for in-page anchors
const anchorize = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Parse the markdown body to extract H2 headings (TOC) and an FAQ list.
function parseStructure(md: string) {
  const lines = md.split(/\r?\n/);
  const toc: { id: string; text: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) toc.push({ id: anchorize(m[1]), text: m[1] });
  }

  // FAQs: find a section heading containing "FAQ" or "FAQs" or "Frequently asked", then collect H3 Q/A pairs until next H2.
  const faqs: { question: string; answer: string }[] = [];
  let inFaq = false;
  let currentQ: string | null = null;
  let buf: string[] = [];
  const pushFaq = () => {
    if (currentQ) {
      faqs.push({ question: currentQ, answer: buf.join("\n").trim() });
    }
    currentQ = null;
    buf = [];
  };
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      if (inFaq) pushFaq();
      inFaq = /faq|frequently asked/i.test(h2[1]);
      continue;
    }
    if (!inFaq) continue;
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      pushFaq();
      currentQ = h3[1].replace(/[?.]?$/, "?");
      continue;
    }
    if (currentQ) buf.push(line);
  }
  if (inFaq) pushFaq();
  return { toc, faqs };
}

const EducationalPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [readingTime, setReadingTime] = useState("5 min read");

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["educationalPost", slug],
    queryFn: () => fetchMarketPost(slug || ""),
    enabled: !!slug,
  });

  const { data: allPosts } = useQuery({
    queryKey: ["educationalPosts"],
    queryFn: fetchMarketPosts,
  });

  useEffect(() => {
    if (post) {
      const wordsPerMinute = 200;
      const wordCount = (post.content || "").split(/\s+/).length;
      const minutes = Math.max(3, Math.ceil(wordCount / wordsPerMinute));
      setReadingTime(`${minutes} min read`);
    }
  }, [post]);

  const { toc, faqs } = useMemo(
    () => (post ? parseStructure(post.content || "") : { toc: [], faqs: [] }),
    [post]
  );

  const categorySlug = categoryToSlug(post?.category);
  const canonical = post ? educationalPostPath(post.category, post.slug) : "";
  const related = (allPosts ?? [])
    .filter((p) => categoryToSlug(p.category) === categorySlug && p.slug !== slug)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-background py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">The educational resource you're looking for doesn't exist or has been moved.</p>
            <Button asChild><Link to="/education">Back to Educational Resources</Link></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const seoTitle = post.seoTitle || `${post.title} | IndianMacro Education`;
  const seoDesc =
    post.seoDescription ||
    post.summary ||
    `Learn about ${post.title}: definition, calculation, why it matters for investors, and India context.`;
  const ogImage = post.ogImage || post.image || "/og-image.jpg";
  const categoryLabel = post.category || "Education";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={post.canonicalUrl || canonical}
        ogImage={ogImage}
        ogType="article"
      />
      <StructuredData
        type="Article"
        headline={post.title}
        description={seoDesc}
        url={canonical}
        datePublished={post.publishedAt || post.date}
        dateModified={post.updatedAt}
        imageUrl={ogImage}
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Education", url: "/education" },
          { name: categoryLabel, url: educationCategoryPath(post.category) },
          { name: post.title, url: canonical },
        ]}
      />
      {faqs.length > 0 && <StructuredData type="FAQPage" items={faqs} />}

      <Navbar />

      <div className="flex-grow bg-background py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6 flex items-center flex-wrap gap-1">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/education" className="hover:text-foreground">Education</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={educationCategoryPath(post.category)} className="hover:text-foreground">{categoryLabel}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground truncate max-w-[40ch]">{post.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_240px] gap-10">
            <article>
              <Button variant="ghost" className="mb-6 -ml-2 group" asChild>
                <Link to={educationCategoryPath(post.category)} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to {categoryLabel}
                </Link>
              </Button>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8 pb-6 border-b">
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" />{readingTime}</div>
                <div className="flex items-center"><User className="h-4 w-4 mr-1.5" />{post.authorName || "Abhishek Gourav"}</div>
                {post.category && (
                  <Link to={educationCategoryPath(post.category)} className="flex items-center hover:text-foreground">
                    <Tag className="h-4 w-4 mr-1.5" />{post.category}
                  </Link>
                )}
              </div>

              <div className="mb-10 rounded-xl overflow-hidden border bg-muted">
                <img
                  src={postImage(post.image, post.slug)}
                  alt={post.title}
                  className="w-full h-auto max-h-[480px] object-cover"
                />
                {post.imageCaption && (
                  <p className="text-sm text-muted-foreground mt-2 text-center italic px-4 pb-3">{post.imageCaption}</p>
                )}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      return <h2 id={anchorize(text)} className="text-2xl font-bold mt-10 mb-4 scroll-mt-24" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      return <h3 id={anchorize(text)} className="text-xl font-semibold mt-6 mb-3 scroll-mt-24" {...props}>{children}</h3>;
                    },
                    p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                    ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                    blockquote: (props) => (
                      <blockquote className="border-l-4 border-accent1 pl-4 italic my-4 text-muted-foreground" {...props} />
                    ),
                    a: (props) => (
                      <a className="text-accent1 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <section className="mt-16 pt-10 border-t">
                  <h2 className="text-2xl font-bold mb-6">More from {categoryLabel}</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {related.map((r) => (
                      <Link key={r.id} to={educationalPostPath(r.category, r.slug)} className="h-full block">
                        <BlogPostCard
                          post={{
                            id: r.id,
                            title: r.title,
                            excerpt: r.summary,
                            date: new Date(r.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                            readTime: `${Math.max(3, Math.ceil((r.content?.split(/\s+/).length ?? 200) / 200))} min read`,
                            author: { name: r.authorName || "Abhishek Gourav" },
                            category: r.category ?? categoryLabel,
                            imageUrl: postImage(r.image, r.slug || r.id),
                          }}
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* TOC */}
            {toc.length > 1 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 border rounded-md bg-card p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">On this page</p>
                  <ul className="space-y-2 text-sm">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="text-foreground/80 hover:text-accent1 leading-snug block">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EducationalPostPage;
