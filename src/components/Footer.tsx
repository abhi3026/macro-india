import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { subscribeToNewsletter } from "@/utils/newsletter";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navCols = [
    {
      title: "Research",
      links: [
        { label: "All Research", to: "/research" },
        { label: "RBI Policy", to: "/research/rbi-policy" },
        { label: "Budget Impact", to: "/research/budget-impact" },
        { label: "Agriculture Outlook", to: "/research/agriculture-outlook" },
      ],
    },
    {
      title: "Data",
      links: [
        { label: "Data Dashboard", to: "/data-dashboard" },
        { label: "Economic Indicators", to: "/economic-indicators" },
        { label: "Interest Rates", to: "/interest-rates" },
        { label: "Live Market Data", to: "/live-market-data" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/about" },
        { label: "Education", to: "/education" },
        { label: "Contact", to: "/contact" },
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-[hsl(240_100%_10%)] text-white/80 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center" aria-label="IndianMacro">
              <img src="/logo.svg" alt="" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-display font-semibold text-white tracking-tight">IndianMacro</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-sm">
              India's premium macroeconomic intelligence platform. Research, data and signal for investors, analysts and finance professionals.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a href="https://www.instagram.com/indianmacroinsights" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram" className="p-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/indian-macro" target="_blank" rel="noopener noreferrer"
                aria-label="LinkedIn" className="p-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:contact@indianmacro.com" aria-label="Email"
                className="p-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {navCols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/70 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">Newsletter</h3>
            <p className="text-sm text-white/60 mb-3">Weekly macro brief. No spam.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input type="email" placeholder="you@firm.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-9"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" size="sm" className="w-full bg-white text-[hsl(240_100%_13%)] hover:bg-white/90"
                disabled={isSubmitting}>
                {isSubmitting ? "..." : (<>Subscribe <ArrowRight className="ml-1 h-3.5 w-3.5" /></>)}
              </Button>
            </form>
          </div>
        </div>

        {/* Sources strip */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs text-white/40 tracking-widest uppercase">Data Sources</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
            {[
              { l: "RBI", h: "https://www.rbi.org.in/" },
              { l: "MOSPI", h: "https://www.mospi.gov.in/" },
              { l: "SEBI", h: "https://www.sebi.gov.in/" },
              { l: "NSE", h: "https://www.nseindia.com/" },
              { l: "BSE", h: "https://www.bseindia.com/" },
            ].map((s) => (
              <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-white transition-colors">
                {s.l} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/40">
          <div>&copy; {new Date().getFullYear()} IndianMacro. All rights reserved.</div>
          <div>For informational purposes only. Not investment advice.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
