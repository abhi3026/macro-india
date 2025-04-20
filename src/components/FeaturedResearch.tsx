
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedResearch = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Featured Research</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Placeholder content - will be replaced with actual research items */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">RBI Policy Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              In-depth analysis of the latest RBI monetary policy and its implications.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/research/rbi-policy" onClick={() => window.scrollTo(0, 0)}>Read More</Link>
            </Button>
          </div>
          {/* Add more research items */}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedResearch;
