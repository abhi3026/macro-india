import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import { fetchResearchPosts, type ResearchPost } from "@/utils/contentLoader";
import { Link } from "react-router-dom";

const CATEGORIES = ["All", "Economic Outlook", "Monetary Policy", "Markets", "Sectors", "Agriculture"] as const;

const ResearchPage = () => {
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchResearchPosts().then((p) => { setPosts(p); setLoading(false); });
  }, []);

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0], [posts]);
  const rest = useMemo(() => posts.filter((p) => p.id !== featured?.id), [posts, featured]);

  const filtered = useMemo(() => {
    return rest.filter((p) => {
      const matchesQ = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
      const matchesC = category === "All" || p.category === category;
      return matchesQ && matchesC;
    });
  }, [rest, query, category]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Economic Research & Analysis | IndianMacro"
        description="In-depth research on India's GDP, inflation, monetary policy, banking, and markets."
        canonicalUrl="/research"
        ogType="article"
        keywords="India economic research, GDP analysis, inflation report India, RBI monetary policy"
      />
      <StructuredData type="BreadcrumbList" items={[{ name: "Home", url: "/" }, { name: "Research", url: "/research" }]} />

      <Navbar />

      <PageHero
        eyebrow="Research · India"
        title="Macro intelligence, written for decisions."
        description="Independent, data-driven research on India's economy, markets and policy. Built for investors and analysts who need depth — not headlines."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Research" }]}
        aside={
          <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-6">
            <p className="text-[11px] tracking-wider uppercase text-white/60">Coverage</p>
            <h3 className="font-display text-lg font-semibold mt-1 text-white">What we research</h3>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80">
              {["GDP & growth", "Inflation & RBI policy", "Banking & credit", "Equity & debt markets", "FX & external sector", "Sector deep-dives"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> {x}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        category === c
                          ? "bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] border-[hsl(var(--brand))]"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              {featured && (
                <article className="surface overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    {featured.image && (
                      <div className="aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
                        <img src={featured.image} alt={featured.title}
                          className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]">Editor's pick</Badge>
                        <span className="text-xs text-muted-foreground">{featured.category}</span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground line-clamp-3">{featured.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground tabular-nums">{featured.date}</span>
                        <Button asChild size="sm" variant="ghost" className="text-[hsl(var(--brand))] hover:text-[hsl(var(--brand))]">
                          <Link to={`/research/${featured.slug}`}>Read report <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid */}
              <section>
                <div className="flex items-end justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">Latest research</h2>
                  <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} reports</span>
                </div>

                {loading ? (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[0,1,2,3].map((i) => <div key={i} className="surface h-64 animate-pulse" />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="surface p-10 text-center text-muted-foreground">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 opacity-60" />
                    No reports match your filters.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {filtered.map((p) => (
                      <Link
                        key={p.id} to={`/research/${p.slug}`}
                        className="surface overflow-hidden group hover:border-[hsl(var(--brand))]/40 transition-colors flex flex-col"
                      >
                        {p.image && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img src={p.image} alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                              loading="lazy" />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[10px] tracking-wider uppercase">{p.category}</Badge>
                            <span className="text-xs text-muted-foreground tabular-nums">{p.date}</span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground leading-snug group-hover:text-[hsl(var(--brand))] transition-colors">
                            {p.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                          <span className="mt-4 inline-flex items-center text-xs text-[hsl(var(--brand))] font-medium">
                            Read report <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="surface p-6 bg-[hsl(240_100%_13%)] text-white border-transparent">
                <p className="text-[11px] tracking-[0.14em] uppercase text-white/60">Newsletter</p>
                <h3 className="font-display text-xl font-semibold mt-1">The Weekly Brief</h3>
                <p className="text-sm text-white/70 mt-2">India's macro & markets, distilled into one email every Monday.</p>
                <Button asChild className="mt-4 w-full bg-white text-[hsl(240_100%_13%)] hover:bg-white/90">
                  <Link to="/?subscribe=1">Subscribe free</Link>
                </Button>
              </div>

              <div className="surface p-6">
                <p className="text-[11px] tracking-wider uppercase text-muted-foreground">Methodology</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Every report is backed by primary data from RBI, MOSPI, SEBI and NSE — sourced, dated and peer-reviewed.
                </p>
                <Link to="/about" className="mt-3 inline-flex items-center text-sm text-[hsl(var(--brand))] font-medium">
                  Read methodology <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResearchPage;
