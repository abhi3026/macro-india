import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { subscribeToNewsletter } from "@/utils/newsletter";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterSignupDialog = ({ open, onOpenChange }: Props) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        localStorage.setItem("newsletter-subscribed", "true");
        toast({ title: "Subscribed", description: result.message });
        setEmail("");
        onOpenChange(false);
      } else {
        toast({ title: "Subscription failed", description: result.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Get IndianMacro research</DialogTitle>
          <DialogDescription>
            Weekly briefings on India's economy, markets and policy — straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="newsletter-dialog-email">Email address</Label>
            <Input
              id="newsletter-dialog-email" type="email" required placeholder="you@firm.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit" disabled={submitting}
            className="w-full bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90"
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Unsubscribe anytime. We never share your email.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSignupDialog;
