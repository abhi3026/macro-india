
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WhatWeOffer = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>What We Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Live Market Data</h3>
            <p className="text-sm text-muted-foreground">
              Real-time updates on Indian and global markets with advanced charting tools.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Research Reports</h3>
            <p className="text-sm text-muted-foreground">
              In-depth analysis and research reports on Indian economy and markets.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Educational Content</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive educational resources for understanding macroeconomics.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatWeOffer;
