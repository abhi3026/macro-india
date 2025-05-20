
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface TradingViewNewsWidgetProps {
  height?: number;
}

const TradingViewNewsWidget = ({ height = 400 }: TradingViewNewsWidgetProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-accent1" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden rounded-md">
          <iframe
            src={`https://s.tradingview.com/embed-widget/timeline/?locale=en#%7B%22colorTheme%22%3A%22${isDarkMode ? 'dark' : 'light'}%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22regular%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A400%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22timeline%22%7D`}
            style={{
              width: "100%",
              height: `${height}px`,
              margin: 0,
              padding: 0,
              border: "none"
            }}
            title="TradingView News"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewNewsWidget;
