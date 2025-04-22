
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, FileText, Video, ArrowRight } from "lucide-react";

const EducationalResources = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Educational Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Book className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Understanding Indian Economy</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive guide to understanding the fundamentals and structure of the Indian economy.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/education/indian-economy-basics" onClick={() => window.scrollTo(0, 0)}>
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Financial Markets Guide</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              An essential guide to understanding Indian financial markets, instruments, and institutions.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/education/financial-markets" onClick={() => window.scrollTo(0, 0)}>
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-5 w-5 text-accent1" />
              <h3 className="font-semibold">Economic Indicators Explained</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Video tutorials explaining key economic indicators and how to interpret them for investment decisions.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/education/economic-indicators" onClick={() => window.scrollTo(0, 0)}>
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalResources;
