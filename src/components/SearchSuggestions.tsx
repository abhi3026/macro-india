
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface SearchItem {
  title: string;
  path: string;
  keywords: string[];
  description: string;
}

const searchItems: SearchItem[] = [
  {
    title: "Research",
    path: "/research",
    keywords: ["research", "analysis", "reports", "insights"],
    description: "Economic and market research reports"
  },
  {
    title: "Live Markets",
    path: "/live-markets",
    keywords: ["markets", "stocks", "trading", "live", "prices"],
    description: "Real-time market data and charts"
  },
  {
    title: "Education",
    path: "/education",
    keywords: ["learn", "education", "tutorials", "guides"],
    description: "Educational resources and guides"
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    keywords: ["dashboard", "overview", "statistics", "data"],
    description: "Economic indicators dashboard"
  }
];

export const SearchSuggestions = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setOpen(false);
  };

  return (
    <Command className="relative rounded-lg border max-w-lg">
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput 
          placeholder="Search pages..." 
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <CommandList className="absolute top-full left-0 right-0 z-50 bg-popover border rounded-b-lg max-h-[300px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {searchItems.map((item) => (
            <CommandItem
              key={item.path}
              value={item.title}
              onSelect={() => handleSelect(item.path)}
              className="cursor-pointer"
            >
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
