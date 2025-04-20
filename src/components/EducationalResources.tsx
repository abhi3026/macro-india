
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EducationalResources = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Educational Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Placeholder content - will be replaced with actual educational resources */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Understanding Indian Economy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive guide to understanding the basics of Indian economy.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/education/indian-economy-basics" onClick={() => window.scrollTo(0, 0)}>Learn More</Link>
            </Button>
          </div>
          {/* Add more educational resources */}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalResources;
