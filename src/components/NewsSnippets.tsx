
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// News snippet type
interface NewsSnippet {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
}

// Mock news data
const NEWS_DATA: NewsSnippet[] = [
  {
    id: "1",
    title: "RBI keeps repo rate unchanged at 6.5% for seventh consecutive time",
    source: "Economic Times",
    time: "2 hours ago",
    url: "#"
  },
  {
    id: "2",
    title: "India's manufacturing PMI slips to 3-month low in April 2025",
    source: "Business Standard",
    time: "4 hours ago",
    url: "#"
  },
  {
    id: "3",
    title: "Foreign investors pull out ₹15,000 crore from Indian equities in April",
    source: "LiveMint",
    time: "6 hours ago",
    url: "#"
  },
  {
    id: "4",
    title: "Government increases MSP for kharif crops ahead of monsoon season",
    source: "Financial Express",
    time: "8 hours ago",
    url: "#"
  },
  {
    id: "5",
    title: "India's fiscal deficit narrows to 5.2% of GDP in FY25",
    source: "Bloomberg Quint",
    time: "10 hours ago",
    url: "#"
  }
];

const NewsSnippets = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {NEWS_DATA.map((news) => (
            <div key={news.id} className="pb-3 border-b last:border-0 last:pb-0">
              <a 
                href={news.url} 
                className="block hover:text-accent1 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <h3 className="font-medium text-base mb-1 line-clamp-2">{news.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{news.source}</span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{news.time}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4" asChild>
          <a href="https://www.Bloomberg.com" target="_blank" rel="noopener noreferrer">
            View All News <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsSnippets;
