
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Area, 
  Bar, 
  AreaChart as RechartsAreaChart, 
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
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

  // Transform data for recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

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
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <RechartsAreaChart data={transformedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {data.datasets.map((dataset, index) => (
                    <linearGradient key={index} id={`color-${dataset.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={dataset.borderColor || "#3b82f6"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={dataset.borderColor || "#3b82f6"} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                {data.datasets.map((dataset, index) => (
                  <Area 
                    key={index}
                    type="monotone" 
                    dataKey={dataset.label} 
                    stroke={dataset.borderColor || "#3b82f6"} 
                    fillOpacity={1} 
                    fill={`url(#color-${dataset.label})`} 
                  />
                ))}
              </RechartsAreaChart>
            ) : (
              <RechartsBarChart data={transformedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                {data.datasets.map((dataset, index) => (
                  <Bar 
                    key={index} 
                    dataKey={dataset.label} 
                    fill={dataset.backgroundColor || dataset.borderColor || "#3b82f6"} 
                  />
                ))}
              </RechartsBarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataWidget;
