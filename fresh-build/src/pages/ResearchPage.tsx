
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchCard from "@/components/ResearchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchResearchPosts, ResearchPost } from "@/utils/contentLoader";
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";

const categories = [
  "All Categories",
  "Economic Outlook",
  "Monetary Policy",
  "Agriculture",
  "Infrastructure",
  "Investment",
  "Banking",
  "Technology",
  "Trade"
];

const ResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  
  // Fetch research posts from CMS
  const { data: researchData, isLoading, error } = useQuery({
    queryKey: ['researchPosts'],
    queryFn: fetchResearchPosts,
  });
  
  // Update meta tags on component mount
  useEffect(() => {
    updateMetaTags(
      "Research Repository | IndianMacro",
      "Access our comprehensive collection of economic research, reports, and analysis covering various aspects of the Indian economy.",
      "/research"
    );
  }, []);
  
  // Filter research based on search query and filters
  const filteredResearch = researchData ? researchData.filter((item) => {
    // Search query filter
    const matchesQuery = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Category filter
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
      
    // Premium filter
    const matchesPremium = !showPremiumOnly || item.premium;
    
    return matchesQuery && matchesCategory && matchesPremium;
  }) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Research Repository | IndianMacro"
        description="Access our comprehensive collection of economic research, reports, and analysis covering various aspects of the Indian economy."
        canonicalUrl="/research"
      />
      
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Research Repository</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Access our comprehensive collection of economic research, reports, and analysis covering various aspects of the Indian economy.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow bg-white dark:bg-indianmacro-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="browse" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="browse">Browse Research</TabsTrigger>
              <TabsTrigger value="upload">Upload Research</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search research by title or keywords..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
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
                  
                  <Button
                    variant={showPremiumOnly ? "default" : "outline"}
                    className={showPremiumOnly ? "bg-accent1 hover:bg-accent1/90" : ""}
                    onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                  >
                    Premium Only
                  </Button>
                </div>
              </div>
              
              {/* Research Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-indianmacro-200 dark:bg-indianmacro-700 rounded-t-lg"></div>
                      <CardHeader>
                        <div className="h-6 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-indianmacro-200 dark:bg-indianmacro-700 rounded w-3/4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredResearch.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResearch.map((item) => (
                    <Link key={item.id} to={`/research/${item.slug}`}>
                      <ResearchCard 
                        research={item} 
                        variant={item.featured ? "featured" : "default"} 
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-indianmacro-600 dark:text-indianmacro-400">No research found matching your search criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategories([]);
                      setShowPremiumOnly(false);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Research</CardTitle>
                  <CardDescription>
                    Share your economic research, articles, or data analysis with the IndianMacro community.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Research Title
                    </label>
                    <Input id="title" placeholder="Enter a descriptive title for your research" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="w-full min-h-[100px] p-3 border rounded-md bg-background"
                      placeholder="Provide a brief summary of your research"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-indianmacro-400" />
                    <p className="mt-2 text-sm text-indianmacro-600 dark:text-indianmacro-400">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-indianmacro-500 dark:text-indianmacro-500">
                      Supports PDF, DOCX, XLSX, CSV (max 10MB)
                    </p>
                    <Button variant="outline" className="mt-4">
                      Select File
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent1 hover:bg-accent1/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Research
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;
