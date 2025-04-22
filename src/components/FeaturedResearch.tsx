
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedResearch = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Featured Research</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">RBI Policy Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              In-depth analysis of the latest RBI monetary policy decisions and their implications for the Indian economy.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/research/rbi-policy" onClick={() => window.scrollTo(0, 0)}>
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">Budget Impact Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive analysis of the Union Budget and its potential impact on various sectors of the Indian economy.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/research/budget-impact" onClick={() => window.scrollTo(0, 0)}>
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">Agriculture Sector Outlook</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analysis of current trends, challenges, and future prospects for India's agricultural sector.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/research/agriculture-outlook" onClick={() => window.scrollTo(0, 0)}>
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedResearch;
