
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchCard, { ResearchItem } from "@/components/ResearchCard";
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

// Sample research data
const researchData: ResearchItem[] = [
  {
    id: "1",
    title: "Indian Economic Outlook 2025",
    description: "Comprehensive analysis of India's economic trajectory for the coming year with key indicators and growth projections.",
    date: "April 2, 2025",
    category: "Economic Outlook",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fileUrl: "#",
    featured: true
  },
  {
    id: "2",
    title: "Impact of Monetary Policy on Indian Markets",
    description: "Analysis of how RBI's latest monetary policy decisions are affecting various sectors of the Indian economy.",
    date: "March 28, 2025",
    category: "Monetary Policy",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fileUrl: "#"
  },
  {
    id: "3",
    title: "Agricultural Trends & Food Security",
    description: "Examination of current agricultural output, challenges, and implications for India's food security.",
    date: "March 20, 2025",
    category: "Agriculture",
    imageUrl: "https://images.unsplash.com/photo-1589256479193-9ff1356bed98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
    fileUrl: "#"
  },
  {
    id: "4",
    title: "Infrastructure Spending and Economic Growth",
    description: "Analysis of the relationship between infrastructure investment and GDP growth in India.",
    date: "March 15, 2025",
    category: "Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1621447980929-6637edb30e31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fileUrl: "#"
  },
  {
    id: "5",
    title: "Foreign Direct Investment Trends in India",
    description: "Comprehensive analysis of FDI inflows, sector-wise distribution, and policy impact.",
    date: "March 10, 2025",
    category: "Investment",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    fileUrl: "#",
    premium: true
  },
  {
    id: "6",
    title: "Banking Sector Health: NPA Analysis",
    description: "Assessment of the current state of non-performing assets in the Indian banking system.",
    date: "March 5, 2025",
    category: "Banking",
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fileUrl: "#",
    premium: true
  },
  {
    id: "7",
    title: "Digital Economy: Growth and Challenges",
    description: "Examination of India's digital economy landscape, growth opportunities, and regulatory challenges.",
    date: "February 28, 2025",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fileUrl: "#"
  },
  {
    id: "8",
    title: "India's Export Competitiveness",
    description: "Analysis of factors affecting India's export performance and global competitiveness.",
    date: "February 20, 2025",
    category: "Trade",
    imageUrl: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
    fileUrl: "#"
  }
];

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
  
  // Filter research based on search query and filters
  const filteredResearch = researchData.filter((item) => {
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
  });

  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="flex-grow bg-white">
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
              {filteredResearch.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResearch.map((item) => (
                    <ResearchCard 
                      key={item.id} 
                      research={item} 
                      variant={item.featured ? "featured" : "default"} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-indianmacro-600">No research found matching your search criteria.</p>
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
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="Provide a brief summary of your research"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
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
                    <p className="mt-2 text-sm text-indianmacro-600">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-indianmacro-500">
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
