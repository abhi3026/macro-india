
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { subscribeToNewsletter } from "@/utils/newsletter";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleMailClick = () => {
    window.location.href = "mailto:contact@indianmacro.com";
  };
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#000041] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div>
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="IndianMacro" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold">IndianMacro</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Your comprehensive source for Indian economic data, financial market analysis, and research.
            </p>
            <div className="mt-4 flex space-x-4">
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

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Site Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-gray-300 hover:text-white">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-gray-300 hover:text-white">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/data-dashboard" className="text-gray-300 hover:text-white">
                  Data Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: External Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">External Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.rbi.org.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <span>Reserve Bank of India</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.mospi.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <span>MOSPI</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.sebi.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <span>SEBI</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nseindia.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <span>NSE</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.bseindia.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <span>BSE</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates on Indian economy and markets.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#000060] border-[#00003a] text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="ml-2 bg-accent1 hover:bg-accent1/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section with Copyright and Links */}
        <div className="mt-12 pt-8 border-t border-[#00003a] flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} IndianMacro. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
