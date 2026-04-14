import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import TradingViewTimeline from "@/components/TradingViewTimeline";

export default function NewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title="Market News & Timeline | IndianMacro"
        description="Stay updated with real-time market news, financial headlines, and economic developments impacting Indian and global markets. Live market timeline powered by TradingView."
        canonicalUrl="/news"
        keywords="market news India, financial news, stock market updates, economic news India, Nifty news, Sensex updates"
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: 'Home', url: '/' },
          { name: 'News', url: '/news' },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Market News & Timeline</h1>
            <p className="text-lg text-muted-foreground">
              Stay informed with the latest market movements, financial headlines, and economic developments
            </p>
          </div>

          <div className="flex justify-center">
            <TradingViewTimeline />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
