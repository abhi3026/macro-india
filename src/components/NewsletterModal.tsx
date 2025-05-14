
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual implementation when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log and show success
      console.log("Newsletter subscription for:", email);
      toast.success("Successfully subscribed to newsletter!");
      
      // Clear form and close modal
      setEmail("");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-indianmacro-900 rounded-lg max-w-md w-full p-6 shadow-xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close newsletter modal"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-muted-foreground">
            Subscribe to our newsletter for the latest insights on Indian economy and financial markets.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-accent1 hover:bg-accent1/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy and will never share your information.
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewsletterModal;
