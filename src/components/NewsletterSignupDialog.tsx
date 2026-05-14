import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { subscribeToNewsletter, type SubscriptionResult } from "@/utils/newsletter";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterSignupDialog = ({ open, onOpenChange }: Props) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubscriptionResult | null>(null);

  const reset = () => {
    setEmail("");
    setResult(null);
    setSubmitting(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setResult(null);
    setSubmitting(true);
    const res = await subscribeToNewsletter(email);
    setResult(res);
    if (res.success && !res.alreadySubscribed) {
      localStorage.setItem("newsletter-subscribed", "true");
    }
    setSubmitting(false);
  };

  const tone = result
    ? result.alreadySubscribed
      ? "info"
      : result.success
        ? "success"
        : "error"
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Get IndianMacro research</DialogTitle>
          <DialogDescription>
            Weekly briefings on India's economy, markets and policy — straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="space-y-4 pt-2" noValidate>
          <div className="space-y-2">
            <Label htmlFor="newsletter-dialog-email">Email address</Label>
            <Input
              id="newsletter-dialog-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@firm.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (result) setResult(null);
              }}
              disabled={submitting}
            />
          </div>

          {result && (
            <div
              role="status"
              aria-live="polite"
              className={[
                "flex items-start gap-2 rounded-md border px-3 py-2 text-sm transition-all animate-in fade-in slide-in-from-top-1",
                tone === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                tone === "info" && "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                tone === "error" && "border-destructive/30 bg-destructive/10 text-destructive",
              ].filter(Boolean).join(" ")}
            >
              {tone === "success" && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
              {tone === "info" && <Info className="h-4 w-4 mt-0.5 shrink-0" />}
              {tone === "error" && <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
              <span>{result.message}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90"
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing…</>
            ) : (
              "Subscribe"
            )}
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
