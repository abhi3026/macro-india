
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ResearchItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string;
  fileUrl?: string;
  premium?: boolean;
  featured?: boolean;
};

interface ResearchCardProps {
  research: ResearchItem;
  variant?: "default" | "featured";
}

const ResearchCard = ({ research, variant = "default" }: ResearchCardProps) => {
  const isFeatured = variant === "featured" || research.featured;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isFeatured && "border-accent1 border-2"
    )}>
      {research.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={research.imageUrl} 
            alt={research.title} 
            className="h-full w-full object-cover" 
          />
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-accent1 hover:bg-accent1">Featured</Badge>
            </div>
          )}
          {research.premium && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-indianmacro-800 text-white hover:bg-indianmacro-700">Premium</Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {research.category}
              </Badge>
              <span className="text-xs text-gray-500">
                {research.date}
              </span>
            </div>
            <CardTitle className="text-xl">{research.title}</CardTitle>
          </div>
          {!research.imageUrl && research.premium && (
            <Badge variant="secondary" className="bg-indianmacro-800 text-white hover:bg-indianmacro-700">
              Premium
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {research.description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Read
        </Button>
        {research.fileUrl && (
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResearchCard;
