
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, LineChart, ExternalLink } from "lucide-react";

const WhatWeOffer = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>What We Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Live Market Data</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time updates on Indian and global markets with advanced charting tools and analysis.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Research Reports</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              In-depth analysis and research reports on Indian economy, industries, and markets by expert economists.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Educational Content</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprehensive educational resources for understanding macroeconomics, financial markets, and investment strategies.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatWeOffer;
