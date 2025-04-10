
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
    { name: "Data Dashboard", path: "/dashboard" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-indianmacro-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="IndianMacro Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-indianmacro-800">
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
                className="px-3 py-2 text-indianmacro-600 hover:text-indianmacro-900 hover:bg-indianmacro-50 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button 
              variant="default" 
              className="ml-4 bg-accent1 hover:bg-accent1/90"
            >
              Subscribe
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indianmacro-600 hover:text-indianmacro-900 hover:bg-indianmacro-50"
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
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-indianmacro-600 hover:text-indianmacro-900 hover:bg-indianmacro-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button 
            variant="default" 
            className="w-full mt-3 bg-accent1 hover:bg-accent1/90"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
