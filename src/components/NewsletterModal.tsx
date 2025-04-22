import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/utils/newsletter";

interface NewsletterModalProps {
  onClose: () => void;
}

const NewsletterModal = ({ onClose }: NewsletterModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Failed to subscribe. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest updates on Indian economy and markets.
        </p>
        
        <form onSubmit={handleSubscribe} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterModal;
> vite_react_shadcn_ts@0.0.0 dev
> vite

X [ERROR] Expected identifier but found "<<"

    vite.config.ts:9:0:
      9 │ <<<<<<< HEAD
        ╵ ~~

failed to load config from C:\Users\lenovo\Downloads\macro-india-main\vite.config.ts
error when starting dev server:
Error: Build failed with 1 error:
vite.config.ts:9:0: ERROR: Expected identifier but found "<<"
    at failureErrorWithLog (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:1477:15)
    at C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:946:25
    at runOnEndCallbacks (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:1317:45)
    at buildResponseToResult (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:944:7)
    at C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:971:16
    at responseCallbacks.<computed> (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:623:9)
    at handleIncomingPacket (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:678:12)
    at Socket.readFromStdout (C:\Users\lenovo\Downloads\macro-india-main\node_modules\esbuild\lib\main.js:601:7)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)