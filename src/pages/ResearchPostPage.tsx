import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, User, Tag, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { fetchResearchPosts, ResearchPost } from "@/utils/contentLoader";
import { postImage } from "@/utils/postImage";

const anchorize = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseToc(md: string) {
  const toc: { id: string; text: string }[] = [];
  for (const line of (md || "").split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) toc.push({ id: anchorize(m[1]), text: m[1] });
  }
  return toc;
}

const ResearchPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [readingTime, setReadingTime] = useState("5 min read");

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["researchPosts"],
    queryFn: fetchResearchPosts,
  });

  const post: ResearchPost | null = useMemo(
    () => posts?.find((p) => p.slug === slug) ?? null,
    [posts, slug]
  );

  const related = useMemo(
    () => (posts ?? []).filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3),
    [posts, post, slug]
  );

  const toc = useMemo(() => (post ? parseToc(post.content) : []), [post]);

  useEffect(() => {
    if (post) {
      const words = (post.content || "").split(/\s+/).length;
      setReadingTime(`${Math.max(3, Math.ceil(words / 200))} min read`);
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow py-10">
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
            <h1 className="text-2xl font-bold mb-4">Research not found</h1>
            <p className="text-muted-foreground mb-6">This report doesn't exist or has been moved.</p>
            <Button asChild><Link to="/research">Back to Research</Link></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.date ? format(new Date(post.date), "MMMM d, yyyy") : "";
  const heroImage = postImage(post.image, post.slug);
  const canonical = `/research/${post.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${post.title} | IndianMacro Research`}
        description={post.description}
        canonicalUrl={canonical}
        ogImage={heroImage}
        ogType="article"
      />
      <StructuredData
        type="Article"
        headline={post.title}
        description={post.description}
        url={canonical}
        datePublished={post.date}
        imageUrl={heroImage}
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Research", url: "/research" },
          { name: post.title, url: canonical },
        ]}
      />

      <Navbar />

      <div className="flex-grow bg-background py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6 flex items-center flex-wrap gap-1">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/research" className="hover:text-foreground">Research</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground truncate max-w-[40ch]">{post.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_240px] gap-10">
            <article>
              <Button variant="ghost" className="mb-6 -ml-2 group" asChild>
                <Link to="/research" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Research
                </Link>
              </Button>

              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8 pb-6 border-b">
                {formattedDate && (
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{formattedDate}</div>
                )}
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" />{readingTime}</div>
                <div className="flex items-center"><User className="h-4 w-4 mr-1.5" />{post.authorName || "Abhishek Gourav"}</div>
                {post.category && (
                  <div className="flex items-center"><Tag className="h-4 w-4 mr-1.5" />{post.category}</div>
                )}
              </div>

              <div className="mb-10 rounded-xl overflow-hidden border bg-muted">
                <img src={heroImage} alt={post.title} className="w-full h-auto max-h-[480px] object-cover" />
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

              {post.file && (
                <div className="mt-10 p-5 border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Download full report</h3>
                    <p className="text-sm text-muted-foreground">PDF version with charts and references.</p>
                  </div>
                  <Button asChild>
                    <a href={post.file} download>Download PDF</a>
                  </Button>
                </div>
              )}

              {related.length > 0 && (
                <section className="mt-16 pt-10 border-t">
                  <h2 className="text-2xl font-bold mb-6">More research</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {related.map((r) => (
                      <Link key={r.id} to={`/research/${r.slug}`} className="surface overflow-hidden group flex flex-col hover:border-[hsl(var(--brand))]/40 transition-colors">
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={postImage(r.image, r.slug)} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{r.category}</div>
                          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-[hsl(var(--brand))] transition-colors">{r.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {toc.length > 1 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 border rounded-md bg-card p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">On this page</p>
                  <ul className="space-y-2 text-sm">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="text-foreground/80 hover:text-accent1 leading-snug block">{t.text}</a>
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

export default ResearchPostPage;
