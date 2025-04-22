
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
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";

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
      readTime: `${Math.ceil(post.summary.length / 600)} min read`,
      author: {
        name: "Indian Macro Team",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      category: post.category || "Macroeconomics",
      imageUrl: post.image || "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      featured: post.featured,
      slug: post.slug
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
      
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Educational Resources</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Learn about financial markets, macroeconomics, and important financial concepts with our educational resources.
          </p>
        </div>
      </div>
      
      {/* Featured Post */}
      {!isLoading && filteredPosts.find(post => post.featured) && (
        <div className="bg-white dark:bg-indianmacro-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Featured Resource</h2>
            <div className="max-w-4xl mx-auto">
              {filteredPosts
                .filter(post => post.featured)
                .map(post => (
                  <Link key={post.id} to={`/education/${post.slug}`}>
                    <BlogPostCard post={post} variant="featured" />
                  </Link>
                ))[0]
              }
            </div>
          </div>
        </div>
      )}
      
      {/* Main Educational Content */}
      <div className="flex-grow bg-white dark:bg-indianmacro-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(1).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className={`h-auto py-6 justify-start flex-col items-start ${
                    selectedCategories.includes(category) ? "bg-accent1 hover:bg-accent1/90" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategories(
                      selectedCategories.includes(category)
                        ? selectedCategories.filter((c) => c !== category)
                        : [...selectedCategories, category]
                    );
                  }}
                >
                  <span className="text-lg font-medium">{category}</span>
                  <span className="text-sm mt-1 text-left">
                    {educationalPosts.filter(p => p.category === category).length} articles
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Educational Posts Grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts
                .filter(post => !post.featured)
                .map((post) => (
                  <Link key={post.id} to={`/education/${post.slug}`}>
                    <BlogPostCard key={post.id} post={post} />
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
      
      <Footer />
    </div>
  );
};

export default EducationPage;
