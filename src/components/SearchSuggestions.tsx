
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const popularTopics = [
  { name: "GDP Growth", query: "gdp growth" },
  { name: "Inflation", query: "inflation" },
  { name: "RBI Policy", query: "rbi monetary policy" },
  { name: "Stock Market", query: "stock market" },
  { name: "Interest Rates", query: "interest rates" },
  { name: "Fiscal Policy", query: "fiscal policy" },
  { name: "Foreign Trade", query: "trade deficit" },
  { name: "Banking Sector", query: "banking sector" },
];

const SearchSuggestions = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {popularTopics.map((topic) => (
        <Button
          key={topic.query}
          variant="outline"
          size="sm"
          asChild
        >
          <Link to={`/search?q=${encodeURIComponent(topic.query)}`}>
            {topic.name}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
