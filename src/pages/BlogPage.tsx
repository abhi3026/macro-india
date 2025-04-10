
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard, { BlogPost } from "@/components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding India's Current Account Deficit",
    excerpt: "A deep dive into the factors affecting India's current account balance and its implications for the economy.",
    date: "April 5, 2025",
    readTime: "8 min read",
    author: {
      name: "Raj Sharma",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    category: "Trade Balance",
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    featured: true
  },
  {
    id: "2",
    title: "The Inflation Challenge: Navigating Rising Prices",
    excerpt: "Analysis of current inflation trends and strategies for businesses and consumers to adapt.",
    date: "April 1, 2025",
    readTime: "6 min read",
    author: {
      name: "Priya Desai",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    category: "Inflation",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "3",
    title: "RBI's Monetary Policy: Impact on Various Sectors",
    excerpt: "Examining how the central bank's decisions affect different parts of the Indian economy.",
    date: "March 28, 2025",
    readTime: "7 min read",
    author: {
      name: "Amit Patel",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    category: "Monetary Policy",
    imageUrl: "https://images.unsplash.com/photo-1565514020179-026b92b2d71b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "4",
    title: "Digital Rupee: India's CBDC Journey",
    excerpt: "Tracking the development and potential impact of India's digital currency initiative.",
    date: "March 25, 2025",
    readTime: "10 min read",
    author: {
      name: "Nisha Kumar",
      avatarUrl: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    category: "Digital Economy",
    imageUrl: "https://images.unsplash.com/photo-1518544801976-3e160afe6c77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
  },
  {
    id: "5",
    title: "Export-Led Growth: Opportunities and Challenges",
    excerpt: "Analysis of India's export potential and the obstacles to achieving sustainable growth through exports.",
    date: "March 20, 2025",
    readTime: "5 min read",
    author: {
      name: "Vikram Singh",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    category: "Trade",
    imageUrl: "https://images.unsplash.com/photo-1579618229285-d11be78cd4a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
  },
  {
    id: "6",
    title: "Budget 2025: Key Takeaways for the Economy",
    excerpt: "Breaking down the major announcements in the latest union budget and their economic implications.",
    date: "March 15, 2025",
    readTime: "12 min read",
    author: {
      name: "Sunita Rao",
      avatarUrl: "https://randomuser.me/api/portraits/women/78.jpg"
    },
    category: "Fiscal Policy",
    imageUrl: "https://images.unsplash.com/photo-1554672408-730436b60dde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "7",
    title: "Manufacturing Sector Revival: Policy Measures",
    excerpt: "Examining the initiatives to boost India's manufacturing competitiveness and create jobs.",
    date: "March 10, 2025",
    readTime: "9 min read",
    author: {
      name: "Rajeev Mehta",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    category: "Industry",
    imageUrl: "https://images.unsplash.com/photo-1573596592813-d5cc133f9c93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "8",
    title: "Banking Sector Health: NPA Trends",
    excerpt: "Analysis of the current state of non-performing assets in the Indian banking system.",
    date: "March 5, 2025",
    readTime: "7 min read",
    author: {
      name: "Anjali Sharma",
      avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    category: "Banking",
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

const categories = [
  "All Categories",
  "Trade Balance",
  "Inflation",
  "Monetary Policy",
  "Digital Economy",
  "Trade",
  "Fiscal Policy",
  "Industry",
  "Banking"
];

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Filter blog posts based on search query and filters
  const filteredPosts = blogPosts.filter((post) => {
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
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Macroeconomic Insights</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Expert analysis, commentary, and perspective on India's economy, markets, and financial trends.
          </p>
        </div>
      </div>
      
      {/* Featured Post */}
      {filteredPosts.find(post => post.featured) && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Featured Insight</h2>
            <div className="max-w-4xl mx-auto">
              {filteredPosts
                .filter(post => post.featured)
                .map(post => (
                  <BlogPostCard key={post.id} post={post} variant="featured" />
                ))[0]
              }
            </div>
          </div>
        </div>
      )}
      
      {/* Main Blog Content */}
      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles by title or content..."
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
          
          {/* Blog Posts Grid */}
          {filteredPosts.filter(post => !post.featured).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts
                .filter(post => !post.featured)
                .map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-indianmacro-600">No articles found matching your search criteria.</p>
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
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-accent1 text-white hover:bg-accent1/90">
                1
              </Button>
              <Button variant="outline">
                2
              </Button>
              <Button variant="outline">
                3
              </Button>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
