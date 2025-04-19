
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Flag } from "lucide-react";
import { useState, useEffect } from "react";

interface EconomicEvent {
  time: string;
  country: string;
  flag: string;
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: "High" | "Medium" | "Low";
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
    impact: "High"
  },
  {
    time: "14:00",
    country: "Eurozone",
    flag: "🇪🇺",
    event: "ECB Interest Rate Decision",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.50%",
    impact: "High"
  },
  {
    time: "15:30",
    country: "India",
    flag: "🇮🇳",
    event: "WPI Inflation YoY",
    actual: "0.52%",
    forecast: "0.50%",
    previous: "0.27%",
    impact: "Medium"
  },
  {
    time: "18:00",
    country: "United Kingdom",
    flag: "🇬🇧",
    event: "BoE Financial Stability Report",
    impact: "High"
  },
];

const EconomicCalendar = () => {
  const [events, setEvents] = useState<EconomicEvent[]>(INITIAL_EVENTS);
  const [currentDate] = useState(new Date());

  const getImpactColor = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
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
                <TableRow key={index}>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{event.flag}</span>
                      <span className="hidden md:inline">{event.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell className="text-right font-medium">
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
