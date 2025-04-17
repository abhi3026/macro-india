
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // In a real application, this would send the data to your server
      console.log("Contact form submitted:", { name, email, subject, message });
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-indianmacro-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 max-w-3xl text-indianmacro-200">
            Have questions, suggestions, or want to collaborate? Reach out to our team and we'll get back to you promptly.
          </p>
        </div>
      </div>
      
      {/* Contact Form Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-indianmacro-800 mb-6">
                Get in Touch
              </h2>
              <p className="text-indianmacro-600 mb-8">
                Whether you're looking for specific economic research, have feedback, or want to explore partnership opportunities, we'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-accent1 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-indianmacro-800">Email</h3>
                    <p className="text-indianmacro-600">contact@indianmacro.com</p>
                    <p className="text-indianmacro-500 text-sm">
                      For general inquiries
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-accent1 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-indianmacro-800">Phone</h3>
                    <p className="text-indianmacro-600">+91 7033816204</p>
                    <p className="text-indianmacro-500 text-sm">
                      Mon-Fri, 9:30 AM - 6:30 PM IST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-accent1 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-indianmacro-800">Location</h3>
                    <p className="text-indianmacro-600">
                      Delhi, India /
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent1 hover:bg-accent1/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Research Request Section */}
      <div className="bg-indianmacro-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-indianmacro-800">
              Request Custom Research
            </h2>
            <p className="text-indianmacro-600 mt-2 max-w-2xl mx-auto">
              Looking for specific economic data or analysis? Let us know what research would be valuable for you.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <FeedbackForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
