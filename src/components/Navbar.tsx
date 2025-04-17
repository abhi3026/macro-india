import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewsletterModal from "@/components/NewsletterModal";
import { subscribeToNewsletter } from "@/utils/newsletter";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
    { name: "Data Dashboard", path: "/dashboard" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSubscribeClick = () => {
    setNewsletterModalOpen(true);
    // Close mobile menu if it's open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="IndianMacro Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-foreground">
                IndianMacro
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <Dialog open={newsletterModalOpen} onOpenChange={setNewsletterModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="ml-4 bg-accent1 hover:bg-accent1/90"
                  onClick={handleSubscribeClick}
                >
                  Subscribe
                </Button>
              </DialogTrigger>
              <NewsletterModal />
            </Dialog>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden transition-all duration-200 ease-in-out", 
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Dialog open={newsletterModalOpen} onOpenChange={setNewsletterModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                className="w-full mt-3 bg-accent1 hover:bg-accent1/90"
                onClick={handleSubscribeClick}
              >
                Subscribe
              </Button>
            </DialogTrigger>
            <NewsletterModal />
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
