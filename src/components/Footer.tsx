
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const handleMailClick = () => {
    window.location.href = "mailto:contact@indianmacro.com";
  };

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
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
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IndianMacro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
