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
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col",
        isFeatured && "border-accent1 border-2"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted shrink-0">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={`Cover image for blog post: ${post.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
        {isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-accent1 hover:bg-accent1">Featured</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-lg leading-snug line-clamp-2 min-h-[3.5rem]">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 min-h-[4.5rem]">
          {post.excerpt}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between mt-auto pt-3 border-t">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{post.author.name}</span>
        </div>
        <Button variant="ghost" size="sm" aria-label={`Read full article: ${post.title}`}>
          Read full article
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
