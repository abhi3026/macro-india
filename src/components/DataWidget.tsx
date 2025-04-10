
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DataWidgetProps = {
  title: string;
  description?: string;
  chartType: "area" | "bar";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill?: boolean;
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
  latestValue?: string;
  latestDate?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
};

const DataWidget = ({
  title,
  description,
  chartType,
  data,
  latestValue,
  latestDate,
  trend,
  className
}: DataWidgetProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-accent2";
    if (trend === "down") return "text-accent3";
    return "text-gray-500";
  };

  const getTrendText = () => {
    if (trend === "up") return "Increasing";
    if (trend === "down") return "Decreasing";
    return "Stable";
  };

  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          {trend && (
            <Badge variant="outline" className={cn("font-normal", getTrendColor())}>
              {getTrendText()}
            </Badge>
          )}
        </div>
        {latestValue && (
          <div className="mt-2">
            <span className="text-2xl font-bold">{latestValue}</span>
            {latestDate && (
              <span className="text-xs text-gray-500 ml-2">as of {latestDate}</span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-56">
          {chartType === "area" ? (
            <AreaChart
              data={data}
              categories={data.labels}
              className="w-full h-full"
            />
          ) : (
            <BarChart
              data={data}
              categories={data.labels}
              className="w-full h-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataWidget;
