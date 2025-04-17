
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchResearchPosts, ResearchPost } from '@/utils/contentLoader';
import { updateMetaTags } from '@/utils/metaTags';
import SEOHead from '@/components/SEOHead';
import { format } from 'date-fns';

// Will be used for rendering markdown content
import remarkGfm from 'remark-gfm';
import { Skeleton } from '@/components/ui/skeleton';

const ResearchPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ResearchPost | null>(null);
  
  // Query to fetch research posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['researchPosts'],
    queryFn: fetchResearchPosts,
  });
  
  useEffect(() => {
    if (posts && slug) {
      const currentPost = posts.find(p => p.slug === slug) || null;
      setPost(currentPost);
      
      // Update meta tags when post is loaded
      if (currentPost) {
        updateMetaTags(
          currentPost.title,
          currentPost.description,
          `/research/${currentPost.slug}`
        );
      }
    }
  }, [posts, slug]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Research
              </Button>
            </div>
            
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="h-64 w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle error state
  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-8 pb-16 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Research Post Not Found</h1>
            <p className="mb-6 text-indianmacro-600">
              The research post you're looking for could not be found or is no longer available.
            </p>
            <Button asChild>
              <Link to="/research">Return to Research</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Format the date for display
  const formattedDate = post.date ? format(new Date(post.date), 'MMMM d, yyyy') : '';
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={`${post.title} | IndianMacro Research`}
        description={post.description}
        canonicalUrl={`/research/${post.slug}`}
        ogImage={post.image}
        ogType="article"
      />
      
      <Navbar />
      
      <div className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/research">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Research
              </Link>
            </Button>
            
            <div className="text-sm text-indianmacro-500">
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
              {post.premium && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-accent1 font-medium">Premium</span>
                </>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover" 
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
          
          {post.file && (
            <div className="mt-8 p-4 border border-indianmacro-200 rounded-lg">
              <h3 className="font-medium mb-2">Download Report</h3>
              <Button asChild>
                <a href={post.file} download>
                  Download PDF
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResearchPostPage;
