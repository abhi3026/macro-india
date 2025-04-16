
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-indianmacro-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  Content
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/research" className="text-base text-gray-300 hover:text-white">
                      Research
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-base text-gray-300 hover:text-white">
                      Data Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-base text-gray-300 hover:text-white">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 xl:mt-0">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-300">
              Get the latest research and macroeconomic insights delivered to your inbox.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <Input
                type="email"
                name="email"
                id="email-address"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="bg-indianmacro-700 border-indianmacro-600 text-white"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <Button type="submit" className="w-full bg-accent1 hover:bg-accent1/90">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
          <div className="mt-12 xl:mt-0 xl:ml-8">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Connect with us
            </h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https:/www.linkedin.com/company/indian-macro/" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="mailto:contact@indianmacro.com" className="text-gray-300 hover:text-white">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-8 text-base text-gray-300">
              IndianMacro © {new Date().getFullYear()}<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
