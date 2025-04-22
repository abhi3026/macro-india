import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EconomicCalendarProps {
  height?: number;
}

const EconomicCalendar = ({ height = 600 }: EconomicCalendarProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent1" />
          Economic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src="https://s.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A600%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22countryFilter%22%3A%22in%2Cus%2Ccn%2Cjp%2Cde%2Cgb%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22events%22%7D"
          style={{
            width: "100%",
            height: `${height}px`,
            margin: 0,
            padding: 0,
            border: "none"
          }}
          title="TradingView Economic Calendar"
        />
      </CardContent>
    </Card>
  );
};

export default EconomicCalendar;
