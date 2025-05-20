
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
  research?: ResearchItem;
  variant?: "default" | "featured";
  // Add these direct props to support both formats
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  image?: string;
  href?: string;
}

const ResearchCard = ({ 
  research, 
  variant = "default",
  title: directTitle,
  description: directDescription,
  date: directDate,
  category: directCategory,
  image: directImage,
  href
}: ResearchCardProps) => {
  // Support both formats - either a research object or direct props
  const isFeatured = variant === "featured" || research?.featured;
  
  // Use research object if available, otherwise use direct props
  const title = research?.title || directTitle || "";
  const description = research?.description || directDescription || "";
  const date = research?.date || directDate || "";
  const category = research?.category || directCategory || "";
  const imageUrl = research?.imageUrl || directImage || "";
  const isPremium = research?.premium || false;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isFeatured && "border-accent1 border-2"
    )}>
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover" 
          />
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-accent1 hover:bg-accent1">Featured</Badge>
            </div>
          )}
          {isPremium && (
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
                {category}
              </Badge>
              <span className="text-xs text-gray-500">
                {date}
              </span>
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {!imageUrl && isPremium && (
            <Badge variant="secondary" className="bg-indianmacro-800 text-white hover:bg-indianmacro-700">
              Premium
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="flex items-center gap-2" asChild={!!href}>
          {href ? (
            <a href={href}>
              <Eye className="h-4 w-4" />
              Read
            </a>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Read
            </>
          )}
        </Button>
        {research?.fileUrl && (
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
