
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Flag, ExternalLink } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EconomicEvent {
  time: string;
  country: string;
  flag: string;
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: "High" | "Medium" | "Low";
  link?: string;
}

const INITIAL_EVENTS: EconomicEvent[] = [
  {
    time: "12:30",
    country: "United States",
    flag: "🇺🇸",
    event: "Initial Jobless Claims",
    actual: "215K",
    forecast: "214K",
    previous: "212K",
    impact: "High",
    link: "https://www.bls.gov/news.release/pdf/empsit.pdf"
  },
  {
    time: "14:00",
    country: "Eurozone",
    flag: "🇪🇺",
    event: "ECB Interest Rate Decision",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.50%",
    impact: "High",
    link: "https://www.ecb.europa.eu/home/html/index.en.html"
  },
  {
    time: "15:30",
    country: "India",
    flag: "🇮🇳",
    event: "WPI Inflation YoY",
    actual: "0.52%",
    forecast: "0.50%",
    previous: "0.27%",
    impact: "Medium",
    link: "https://eaindustry.nic.in/"
  },
  {
    time: "18:00",
    country: "United Kingdom",
    flag: "🇬🇧",
    event: "BoE Financial Stability Report",
    impact: "High",
    link: "https://www.bankofengland.co.uk/financial-stability"
  },
  {
    time: "08:30",
    country: "Japan",
    flag: "🇯🇵",
    event: "Tokyo CPI (YoY)",
    actual: "2.2%",
    forecast: "2.1%",
    previous: "2.0%",
    impact: "Medium",
    link: "https://www.stat.go.jp/english/data/cpi/index.html"
  },
  {
    time: "10:00",
    country: "Germany",
    flag: "🇩🇪",
    event: "Ifo Business Climate",
    actual: "86.4",
    forecast: "85.8",
    previous: "85.5",
    impact: "Medium",
    link: "https://www.ifo.de/en"
  },
];

const EconomicCalendar = () => {
  const [events, setEvents] = useState<EconomicEvent[]>(INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const getImpactColor = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  // Function to periodically update event data (simulating real-time updates)
  const updateEventsData = useCallback(() => {
    // Prevent multiple simultaneous updates
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    // Occasionally update forecast or actual values to simulate live data
    const shouldUpdate = Math.random() > 0.7; // 30% chance to update
    
    if (shouldUpdate) {
      setEvents(prevEvents => {
        return prevEvents.map(event => {
          // Only update some events (not all at once)
          if (Math.random() > 0.7) {
            // Randomly decide what to update
            const updateType = Math.floor(Math.random() * 3);
            
            if (updateType === 0 && event.forecast) {
              // Update forecast
              const currentValue = parseFloat(event.forecast.replace('%', ''));
              const newValue = (currentValue + (Math.random() * 0.1 - 0.05)).toFixed(2);
              return { ...event, forecast: event.forecast.includes('%') ? `${newValue}%` : newValue };
            } else if (updateType === 1 && !event.actual) {
              // Add actual value to an event that didn't have one
              const forecastValue = event.forecast ? parseFloat(event.forecast.replace('%', '')) : 0;
              const actualValue = (forecastValue + (Math.random() * 0.2 - 0.1)).toFixed(2);
              return { ...event, actual: event.forecast?.includes('%') ? `${actualValue}%` : actualValue };
            }
          }
          return event;
        });
      });
    }
    
    // Update current date/time
    setCurrentDate(new Date());
    setIsUpdating(false);
  }, [isUpdating]);

  useEffect(() => {
    // Update every 30 seconds
    updateEventsData();
    const interval = setInterval(updateEventsData, 30000);
    return () => clearInterval(interval);
  }, [updateEventsData]);

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent1" />
          Economic Calendar
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {currentDate.toLocaleDateString("en-US", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Forecast</TableHead>
                <TableHead className="text-right">Previous</TableHead>
                <TableHead className="text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index} className="transition-colors hover:bg-muted/50">
                  <TableCell>{event.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{event.flag}</span>
                      <span className="hidden md:inline">{event.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer">
                          {event.event}
                          {event.link && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{event.event}</h4>
                          <p className="text-xs text-muted-foreground">
                            Economic data release from {event.country}.
                          </p>
                          {event.link && (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs" 
                              asChild
                            >
                              <a 
                                href={event.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                View source <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    event.actual && parseFloat(event.actual.replace('%', '')) > 
                    (event.forecast ? parseFloat(event.forecast.replace('%', '')) : 0) ? 
                    "text-green-600" : event.actual ? "text-red-600" : ""
                  )}>
                    {event.actual || "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {event.forecast || "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {event.previous || "-"}
                  </TableCell>
                  <TableCell className={`text-right ${getImpactColor(event.impact)}`}>
                    {event.impact}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicCalendar;
