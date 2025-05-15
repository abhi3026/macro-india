import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import NewsletterModal from "@/components/NewsletterModal";
import { subscribeToNewsletter } from "@/utils/newsletter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
    { name: "Data Dashboard", path: "/data-dashboard" },
    { name: "Education", path: "/education" },
    { name: "About", path: "/about" }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        localStorage.setItem("newsletter-subscribed", "true");
        
        toast({
          title: "Subscription successful!",
          description: result.message,
        });
        
        setEmail("");
        setSubscribeModalOpen(false);
      } else {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background border-b backdrop-blur-sm bg-background/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center" aria-label="IndianMacro Home">
              <img 
                src="/logo.svg" 
                alt="IndianMacro Logo" 
                className="h-8 w-auto"
                width="32"
                height="32"
              />
              <span className="ml-2 text-xl font-semibold text-foreground">
                IndianMacro
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search markets, news, research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </form>
          </div>

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
            <Button 
              variant="default" 
              className="ml-4 bg-accent1 hover:bg-accent1/90 transition-colors"
              onClick={() => setSubscribeModalOpen(true)}
            >
              Subscribe
            </Button>
            
            <Dialog open={subscribeModalOpen} onOpenChange={setSubscribeModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-indianmacro-800">
                    Subscribe to our newsletter
                  </DialogTitle>
                  <DialogDescription>
                    Get the latest research and macroeconomic insights delivered to your inbox.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubscribe} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subscribe-email">Email address</Label>
                    <Input 
                      id="subscribe-email" 
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
                      className="w-full bg-accent1 hover:bg-accent1/90 transition-colors"
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
          </div>
          
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
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

      <div 
        id="mobile-menu"
        className={cn(
          "md:hidden transition-all duration-200 ease-in-out", 
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-4 py-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search markets, stocks, indices..."
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button 
            variant="default" 
            className="w-full mt-3 bg-accent1 hover:bg-accent1/90 transition-colors"
            onClick={() => {
              setMobileMenuOpen(false);
              setSubscribeModalOpen(true);
            }}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
