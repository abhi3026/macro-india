
import { CalendarIcon, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  category: string;
  imageUrl?: string;
  featured?: boolean;
};

interface BlogPostCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
}

const BlogPostCard = ({ post, variant = "default" }: BlogPostCardProps) => {
  const isFeatured = variant === "featured" || post.featured;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isFeatured && "border-accent1 border-2"
    )}>
      {post.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="h-full w-full object-cover" 
          />
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-accent1 hover:bg-accent1">Featured</Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-xl">{post.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <User className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">{post.author.name}</span>
        </div>
        <Button variant="ghost" size="sm">
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
