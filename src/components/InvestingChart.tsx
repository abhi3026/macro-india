
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";

const InvestingChart = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5 text-accent1" />
          Live Market Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <iframe 
            src="https://www.investing.com/indices/s-p-cnx-nifty-chart"
            title="Investing.com NIFTY Chart"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              overflow: "hidden"
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestingChart;
