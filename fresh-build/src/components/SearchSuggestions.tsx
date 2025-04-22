
import { useState, useEffect, useRef } from 'react';
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
    keywords: ["research", "analysis", "reports", "insights", "economic", "policy", "RBI", "fiscal"],
    description: "Economic and market research reports"
  },
  {
    title: "Live Markets",
    path: "/live-markets",
    keywords: ["markets", "stocks", "trading", "live", "prices", "NSE", "BSE", "Nifty", "Sensex"],
    description: "Real-time market data and charts"
  },
  {
    title: "Education",
    path: "/education",
    keywords: ["learn", "education", "tutorials", "guides", "economics", "finance", "investing"],
    description: "Educational resources and guides"
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    keywords: ["dashboard", "overview", "statistics", "data", "indicators", "economy"],
    description: "Economic indicators dashboard"
  },
  {
    title: "About Us",
    path: "/about",
    keywords: ["about", "company", "team", "mission", "vision", "values", "indianmacro"],
    description: "About IndianMacro and our team"
  },
  {
    title: "Contact",
    path: "/contact",
    keywords: ["contact", "support", "help", "email", "form", "message", "query"],
    description: "Contact our team for support"
  }
];

export const SearchSuggestions = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>(searchItems);
  const commandRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setOpen(false);
    setSearchQuery('');
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setFilteredItems(searchItems);
      return;
    }
    
    // Filter items based on title, keywords, and description
    const query = value.toLowerCase();
    const results = searchItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
    
    setFilteredItems(results);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const inputElement = commandRef.current?.querySelector('input');
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  }, [open]);

  return (
    <div className="relative" ref={commandRef}>
      <div 
        className="flex items-center border rounded-lg px-3 py-2 cursor-pointer hover:border-input"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="text-sm text-muted-foreground">
          Search pages...
        </span>
      </div>
      
      {open && (
        <Command className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border shadow-md bg-popover">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search pages..." 
              value={searchQuery}
              onValueChange={handleInputChange}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {filteredItems.map((item) => (
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
      )}
    </div>
  );
};

export default SearchSuggestions;
