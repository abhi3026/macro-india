
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { subscribeToNewsletter } from "@/utils/newsletter";

const NewsletterModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Show the modal after 5 seconds on the site
    const timer = setTimeout(() => {
      // Check if user has already subscribed
      const hasSubscribed = localStorage.getItem("newsletter-subscribed");
      if (!hasSubscribed) {
        setOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        // Save in localStorage to not show the popup again
        localStorage.setItem("newsletter-subscribed", "true");
        
        // Show success toast
        toast({
          title: "Subscription successful!",
          description: result.message,
        });
        
        setOpen(false);
      } else {
        // Show error toast
        toast({
          title: "Subscription failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indianmacro-800">
            Get exclusive macroeconomic insights
          </DialogTitle>
          <DialogDescription>
            Subscribe to our newsletter and receive the latest research, market analysis, and financial insights directly to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-email">Email address</Label>
            <Input 
              id="newsletter-email" 
              type="email" 
              placeholder="your@email.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-accent1 hover:bg-accent1/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe now"}
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            You can unsubscribe at any time. We'll never share your email.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
