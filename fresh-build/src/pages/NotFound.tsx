
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indianmacro-50 p-4">
      <img 
        src="/logo.svg" 
        alt="IndianMacro Logo" 
        className="h-16 w-auto mb-6"
      />
      <h1 className="text-5xl md:text-6xl font-bold text-indianmacro-800 mb-4">404</h1>
      <p className="text-xl text-indianmacro-600 mb-6 text-center">
        Oops! The page you're looking for cannot be found.
      </p>
      <p className="text-indianmacro-500 mb-8 text-center max-w-md">
        The page may have been moved, deleted, or might never have existed. 
        Please check the URL or navigate back to our homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-accent1 hover:bg-accent1/90">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/research" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Browse Research
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
