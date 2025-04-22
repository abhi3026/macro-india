import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/utils/newsletter";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMailClick = () => {
    window.location.href = "mailto:contact@indianmacro.com";
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-indianmacro-900 text-white mt-8">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
              <img src="/logo.svg" alt="IndianMacro Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-indianmacro-200 text-sm">
              Your trusted source for Indian macroeconomic data, financial markets, and economic research.
            </p>
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:text-accent1"
            >
              <a
                href="https://www.instagram.com/indianmacroinsights"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:text-accent1"
            >
              <a
                href="https://www.linkedin.com/company/indian-macro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-accent1"
              onClick={handleMailClick}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/research" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Research
                </Link>
              </li>
              <li>
                <Link to="/data-dashboard" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Data Dashboard
                </Link>
              </li>
              <li>
                <Link to="/education" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Education
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indianmacro-200 hover:text-white flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Reserve Bank of India
                </a>
              </li>
              <li>
                <a
                  href="https://mospi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indianmacro-200 hover:text-white flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ministry of Statistics
                </a>
              </li>
              <li>
                <a
                  href="https://www.sebi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indianmacro-200 hover:text-white flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  SEBI
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-indianmacro-200 text-sm mb-4">
              Subscribe to our newsletter for the latest updates on Indian economy and markets.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-indianmacro-800 border-indianmacro-700 text-white placeholder:text-indianmacro-400"
                required
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-indianmacro-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indianmacro-200 text-sm">
              &copy; {new Date().getFullYear()} IndianMacro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" onClick={scrollToTop} className="text-indianmacro-200 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
