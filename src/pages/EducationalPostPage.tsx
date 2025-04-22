
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarketPost } from "@/utils/contentLoader";
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";

const EducationalPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [readingTime, setReadingTime] = useState("5 min read");

  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['educationalPost', slug],
    queryFn: () => fetchMarketPost(slug || ''),
    enabled: !!slug
  });

  useEffect(() => {
    if (post) {
      // Update meta tags
      updateMetaTags(
        post.title + " | IndianMacro Education",
        post.summary || "Learn about financial concepts and economic principles with IndianMacro's educational resources.",
        `/education/${slug}`
      );

      // Calculate reading time
      const wordsPerMinute = 200;
      const wordCount = post.content.split(/\s+/).length;
      const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
      setReadingTime(`${readingTimeMinutes} min read`);
    }
  }, [post, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-white dark:bg-indianmacro-900 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex space-x-4 mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-white dark:bg-indianmacro-900 flex items-center justify-center py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-gray-500 mb-6">The educational resource you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link to="/education">Back to Educational Resources</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={`${post.title} | IndianMacro Education`}
        description={post.summary || "Learn about financial concepts and economic principles with IndianMacro's educational resources."}
        canonicalUrl={`/education/${slug}`}
        ogImage={post.image || "/og-image.jpg"}
        ogType="article"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-white dark:bg-indianmacro-900 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6 -ml-2 group"
            asChild
          >
            <Link to="/education" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Educational Resources
            </Link>
          </Button>
          
          {/* Post header */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{readingTime}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>IndianMacro Team</span>
            </div>
            {post.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{post.category}</span>
              </div>
            )}
          </div>
          
          {/* Featured image */}
          {post.image && (
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto rounded-lg object-cover"
              />
              {post.imageCaption && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">{post.imageCaption}</p>
              )}
            </div>
          )}
          
          {/* Post content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-indianmacro-300 pl-4 italic my-4" {...props} />
                ),
                a: ({node, ...props}) => (
                  <a 
                    className="text-accent1 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EducationalPostPage;
