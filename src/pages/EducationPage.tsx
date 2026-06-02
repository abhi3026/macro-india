import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchMarketPosts, MarketPost } from "@/utils/contentLoader";
import { educationalPostPath, educationCategoryPath, categoryToSlug } from "@/utils/categorySlug";
import { postImage } from "@/utils/postImage";
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/page-hero";

const categories = [
  "All Categories",
  "Macroeconomics",
  "Financial Markets",
  "Indian Economy",
  "Monetary Policy",
  "Fiscal Policy",
  "Global Trade",
  "Development Economics"
];

const EducationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Fetch educational posts from CMS
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['educationalPosts'],
    queryFn: fetchMarketPosts,
  });
  
  // Update meta tags on component mount
  useEffect(() => {
    updateMetaTags(
      "Educational Resources | IndianMacro",
      "Learn about financial markets, macroeconomics, and important financial concepts with our educational resources.",
      "/education"
    );
  }, []);
  
  // Transform market data to blog post format
  const transformPostToBlogPost = (post: MarketPost) => {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.summary,
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: `${Math.max(3, Math.ceil((post.content?.split(/\s+/).length ?? 200) / 200))} min read`,
      author: { name: post.authorName || "Abhishek Gourav" },
      category: post.category || "Macroeconomics",
      imageUrl: postImage(post.image, post.slug || post.id),
      featured: post.featured,
      slug: post.slug,
    };
  };
  
  // Filter educational posts based on search query and filters
  const educationalPosts = postsData ? postsData.map(transformPostToBlogPost) : [];
  
  const filteredPosts = educationalPosts.filter((post) => {
    // Search query filter
    const matchesQuery = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Category filter
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(post.category);
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Educational Resources | IndianMacro"
        description="Learn about financial markets, macroeconomics, and important financial concepts with our educational resources."
        canonicalUrl="/education"
      />
      
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <PageHero 
        title="Educational Resources"
        description="Learn about economics, markets, and finance with our educational content"
      />
      
      {/* Main Educational Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex-grow bg-white dark:bg-indianmacro-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search educational resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (category === "All Categories") {
                          setSelectedCategories(checked ? categories.slice(1) : []);
                        } else {
                          setSelectedCategories(
                            checked
                              ? [...selectedCategories, category]
                              : selectedCategories.filter((c) => c !== category)
                          );
                        }
                      }}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Category Sections */}
            <section className="mb-10" aria-labelledby="education-categories-heading">
              <h2 id="education-categories-heading" className="text-2xl font-semibold mb-4">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.slice(1).map((category) => {
                  const count = educationalPosts.filter(p => p.category === category).length;
                  return (
                    <Link
                      key={category}
                      to={educationCategoryPath(category)}
                      className="block h-full rounded-md border bg-card p-6 hover:border-accent1 hover:shadow-md transition-all"
                    >
                      <span className="block text-lg font-medium">{category}</span>
                      <span className="block text-sm mt-1 text-muted-foreground">
                        {count} article{count === 1 ? "" : "s"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
            
            {/* Educational Posts Grid */}
            <section aria-labelledby="education-articles-heading">
              <h2 id="education-articles-heading" className="text-2xl font-semibold mb-4">Latest Articles</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-indianmacro-200 dark:bg-indianmacro-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.filter(post => !post.featured).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {filteredPosts
                  .filter(post => !post.featured)
                  .map((post) => (
                    <Link key={post.id} to={educationalPostPath(post.category, post.slug)} className="h-full block">
                      <BlogPostCard post={post} />
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-indianmacro-600 dark:text-indianmacro-400">No educational resources found matching your search criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EducationPage;
