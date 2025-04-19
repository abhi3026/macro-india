
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { updateMetaTags } from "@/utils/metaTags";
import SEOHead from "@/components/SEOHead";
import { Globe, BarChart2, BookOpen, Users, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  useEffect(() => {
    updateMetaTags(
      "About Us | IndianMacro",
      "Learn about IndianMacro's mission to provide comprehensive macroeconomic data and research for India and global markets.",
      "/about"
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="About Us | IndianMacro"
        description="Learn about IndianMacro's mission to provide comprehensive macroeconomic data and research for India and global markets."
        canonicalUrl="/about"
      />
      
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">About IndianMacro</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Your trusted source for macroeconomic research, data insights, and market analysis.
          </p>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="bg-white dark:bg-indianmacro-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-indianmacro-600 dark:text-indianmacro-300">
              IndianMacro was founded with a clear mission: to make comprehensive macroeconomic data and research accessible, 
              understandable, and actionable for everyone interested in Indian and global markets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-indianmacro-900 dark:text-white">Who We Are</h3>
              <p className="text-indianmacro-600 dark:text-indianmacro-300 mb-4">
                We are a team of economists, data scientists, financial analysts, and technology experts united by 
                our passion for economic research and data transparency.
              </p>
              <p className="text-indianmacro-600 dark:text-indianmacro-300 mb-4">
                Founded in 2022, IndianMacro has quickly grown to become a trusted source of economic insights, 
                helping individuals, businesses, and institutions navigate complex market dynamics with confidence.
              </p>
              <p className="text-indianmacro-600 dark:text-indianmacro-300">
                Our headquarters is in Mumbai, with satellite offices in Delhi and Bangalore, allowing us to maintain 
                close connections with India's economic and financial centers.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                alt="IndianMacro Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* What We Do Section */}
      <div className="bg-indianmacro-50 dark:bg-indianmacro-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-12 text-center">What We Do</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <Globe className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Macroeconomic Research</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  We conduct in-depth analysis of economic trends, policies, and indicators to provide comprehensive 
                  insights into Indian and global economies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <BarChart2 className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Data Visualization</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  We transform complex economic data into clear, interactive visualizations that make information 
                  accessible and actionable for all users.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-indianmacro-900 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent1/10 rounded-full">
                    <BookOpen className="h-8 w-8 text-accent1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Educational Resources</h3>
                <p className="text-indianmacro-600 dark:text-indianmacro-300 text-center">
                  We create educational content to help people understand economic concepts, financial markets, 
                  and investment strategies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="bg-white dark:bg-indianmacro-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-accent1/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-accent1" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-center text-indianmacro-600 dark:text-indianmacro-300">
                We are committed to the highest standards of accuracy, rigor, and professionalism in all our work.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-3 bg-accent1/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-accent1" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accessibility</h3>
              <p className="text-center text-indianmacro-600 dark:text-indianmacro-300">
                We believe economic insights should be available to everyone, not just financial professionals.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-3 bg-accent1/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-accent1" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-center text-indianmacro-600 dark:text-indianmacro-300">
                We maintain independence in our analysis and transparency in our methodologies.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="bg-indianmacro-50 dark:bg-indianmacro-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indianmacro-900 dark:text-white mb-4">Connect With Us</h2>
          <p className="text-indianmacro-600 dark:text-indianmacro-300 max-w-2xl mx-auto mb-8">
            Have questions, feedback, or interested in our research services? We'd love to hear from you.
          </p>
          <div className="inline-flex">
            <a 
              href="/contact" 
              className="bg-accent1 hover:bg-accent1/90 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
