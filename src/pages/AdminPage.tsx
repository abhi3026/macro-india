
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchCMS from "@/components/ResearchCMS";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { updateMetaTags } from "@/utils/metaTags";
import { FileStack, Users, BookText, RefreshCw, BarChart } from "lucide-react";

const AdminPage = () => {
  const [subscriberCount, setSubscriberCount] = useState<number>(128);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Update meta tags for SEO
  useEffect(() => {
    updateMetaTags(
      "Admin Dashboard | IndianMacro",
      "Manage research, content, and subscribers for the IndianMacro platform",
      "/admin"
    );
  }, []);
  
  // Simulate fetching subscriber count
  const refreshSubscriberCount = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Random increase for demo purposes
      setSubscriberCount(prev => prev + Math.floor(Math.random() * 10));
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Subscriber data has been updated",
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Admin Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-indianmacro-200">
            Manage your content, research, and newsletter subscribers.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Research
                </CardTitle>
                <FileStack className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 published this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Newsletter Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{subscriberCount}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshSubscriberCount}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +24 in the last 7 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Blog Posts
                </CardTitle>
                <BookText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  2 drafts pending review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Views
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,432</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Tabs */}
          <Tabs defaultValue="research" className="space-y-6">
            <TabsList>
              <TabsTrigger value="research">Research Manager</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="settings">SEO Settings</TabsTrigger>
            </TabsList>
            
            {/* Research CMS Tab */}
            <TabsContent value="research">
              <ResearchCMS />
            </TabsContent>
            
            {/* Newsletter Management Tab */}
            <TabsContent value="newsletter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscribers</CardTitle>
                      <CardDescription>
                        Manage your newsletter subscribers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-md">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Subscribed On</th>
                                <th className="text-left p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { email: "john.doe@example.com", date: "April 15, 2025", status: "Active" },
                                { email: "sarah.smith@domain.co", date: "April 12, 2025", status: "Active" },
                                { email: "rajesh.kumar@mail.in", date: "April 10, 2025", status: "Active" },
                                { email: "emma.wilson@corp.com", date: "April 8, 2025", status: "Active" },
                                { email: "amit.patel@example.org", date: "April 5, 2025", status: "Inactive" },
                              ].map((subscriber, i) => (
                                <tr key={i} className="border-b">
                                  <td className="p-3">{subscriber.email}</td>
                                  <td className="p-3">{subscriber.date}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      subscriber.status === "Active" 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-gray-100 text-gray-800"
                                    }`}>
                                      {subscriber.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Showing 5 of {subscriberCount} subscribers
                          </div>
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 flex justify-between">
                      <Button variant="outline" size="sm">
                        Export CSV
                      </Button>
                      <Button variant="destructive" size="sm">
                        Remove Selected
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Subscriber</CardTitle>
                      <CardDescription>
                        Manually add a new subscriber to your newsletter.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" placeholder="email@example.com" />
                        </div>
                        <Button className="w-full bg-accent1 hover:bg-accent1/90">
                          Add Subscriber
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Buttondown Integration</CardTitle>
                      <CardDescription>
                        Your newsletter is connected to Buttondown.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="api-key">API Key</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="api-key" 
                              type="password" 
                              value="89bf93c0-5ceb-4421-902a-3ff8baf6d289" 
                              readOnly 
                            />
                            <Button variant="outline" size="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-copy"><path d="M8 1h8a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M2 5h4"/><path d="M2 9h4"/><path d="M2 13h4"/><path d="M2 17h4"/><path d="M15 17h6a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-6"/></svg>
                            </Button>
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="rounded-md bg-green-50 p-3">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                  Integration active
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* SEO Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Configure SEO settings for your website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input id="site-title" defaultValue="IndianMacro - Economic Research & Analysis" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea 
                        id="site-description" 
                        defaultValue="In-depth research, data analysis, and expert insights on Indian economy, markets, and financial trends."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Textarea 
                        id="keywords" 
                        defaultValue="Indian economy, macroeconomics, financial analysis, market research, economic outlook, GDP, inflation, monetary policy"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate keywords with commas
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="social-image">Social Media Image</Label>
                      <div className="mt-1 flex items-center">
                        <img 
                          src="/placeholder.svg" 
                          alt="Social media preview" 
                          className="h-32 w-48 object-cover rounded border"
                        />
                        <div className="ml-4 flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            Change Image
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 1200x630px
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <h3 className="text-lg font-medium">Robots.txt</h3>
                      <Textarea 
                        id="robots" 
                        defaultValue="User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://indianmacro.com/sitemap.xml"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-end space-x-2 bg-muted/10">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-accent1 hover:bg-accent1/90">Save Changes</Button>
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

export default AdminPage;
