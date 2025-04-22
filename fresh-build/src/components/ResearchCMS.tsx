import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileEdit, Trash2, Eye, Save, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type ResearchItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
  fileUrl: string;
  featured?: boolean;
  premium?: boolean;
};

const initialResearch: ResearchItem[] = [
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
  }
];

const categories = [
  "Economic Outlook",
  "Monetary Policy",
  "Agriculture",
  "Infrastructure",
  "Investment",
  "Banking",
  "Technology",
  "Trade"
];

export const ResearchCMS: React.FC = () => {
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(initialResearch);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  
  const filteredResearch = researchItems.filter(
    item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewResearch = () => {
    const newItem: ResearchItem = {
      id: `new-${Date.now()}`,
      title: "New Research",
      description: "",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      category: categories[0],
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      fileUrl: "#",
    };
    setEditingItem(newItem);
  };

  const saveResearch = () => {
    if (!editingItem) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      if (editingItem.id.startsWith('new-')) {
        setResearchItems([...researchItems, { ...editingItem, id: `${researchItems.length + 1}` }]);
      } else {
        setResearchItems(
          researchItems.map(item => item.id === editingItem.id ? editingItem : item)
        );
      }
      
      setEditingItem(null);
      setIsUploading(false);
      
      toast({
        title: "Research saved",
        description: "Your research has been successfully saved.",
      });
    }, 1000);
  };

  const deleteResearch = (id: string) => {
    if (window.confirm("Are you sure you want to delete this research?")) {
      setResearchItems(researchItems.filter(item => item.id !== id));
      
      toast({
        title: "Research deleted",
        description: "The research has been removed.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setEditingItem({ ...editingItem, imageUrl });
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    setEditingItem({ ...editingItem, fileUrl: "#uploaded-pdf" });
    
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded.`,
    });
  };

  const previewResearch = (item: ResearchItem) => {
    toast({
      title: "Preview",
      description: `Previewing "${item.title}"`,
    });
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="manage">Manage Research</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Search research..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={createNewResearch} className="bg-accent1 hover:bg-accent1/90">
              <Plus className="mr-2 h-4 w-4" /> Add New Research
            </Button>
          </div>
          
          {filteredResearch.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No research found. Add some new research to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredResearch.map((item) => (
                <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
                  <div className="w-full sm:w-40 h-32 sm:h-auto">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.date} • {item.category}</p>
                        </div>
                        <div className="flex space-x-1">
                          {item.featured && (
                            <span className="px-2 py-1 bg-accent1/10 text-accent1 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                          {item.premium && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => previewResearch(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingItem(item)}
                      >
                        <FileEdit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteResearch(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Research</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createNewResearch} 
                className="w-full py-8 border-dashed border-2 bg-accent1/5 hover:bg-accent1/10"
              >
                <Upload className="h-6 w-6 mr-2" />
                Create New Research Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Research Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{researchItems.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Featured Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{researchItems.filter(item => item.featured).length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Premium Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{researchItems.filter(item => item.premium).length}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem?.id.startsWith('new-') ? 'Create New Research' : 'Edit Research'}</DialogTitle>
            <DialogDescription>
              Fill in the details of your research report below.
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={editingItem.title} 
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  />
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    value={editingItem.description} 
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editingItem.category}
                    onValueChange={(value) => setEditingItem({...editingItem, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="text"
                    value={editingItem.date} 
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({...editingItem, featured: e.target.checked})}
                  />
                  <Label htmlFor="featured">Featured Research</Label>
                </div>
                
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={editingItem.premium || false}
                    onChange={(e) => setEditingItem({...editingItem, premium: e.target.checked})}
                  />
                  <Label htmlFor="premium">Premium Content</Label>
                </div>
                
                <div className="col-span-2">
                  <Label>Cover Image</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="h-20 w-32 overflow-hidden rounded border">
                      <img src={editingItem.imageUrl} alt="Cover" className="h-full w-full object-cover" />
                    </div>
                    <Label 
                      htmlFor="image-upload" 
                      className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded text-sm"
                    >
                      Change Image
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label>Research PDF</Label>
                  <div className="mt-2">
                    <Label 
                      htmlFor="pdf-upload" 
                      className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded text-sm inline-flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {editingItem.fileUrl === "#" ? "Upload PDF" : "Replace PDF"}
                    </Label>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handlePDFUpload}
                    />
                    {editingItem.fileUrl !== "#" && (
                      <span className="ml-2 text-sm text-muted-foreground">PDF uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button 
              onClick={saveResearch} 
              disabled={isUploading}
              className="bg-accent1 hover:bg-accent1/90"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Research
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchCMS;
