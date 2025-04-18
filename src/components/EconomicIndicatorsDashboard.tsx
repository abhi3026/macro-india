import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorValue {
  value: number;
  change?: number;
  unit: string;
  date: string;
}

type CountryData = {
  name: string;
  code: string;
  flag: string;
  [key: string]: string | IndicatorValue | undefined;
  gdp?: IndicatorValue;
  gdpGrowth?: IndicatorValue;
  inflation?: IndicatorValue;
  interestRate?: IndicatorValue;
  unemployment?: IndicatorValue;
  debtToGdp?: IndicatorValue;
  pmi?: IndicatorValue;
  exports?: IndicatorValue;
};

const DEFAULT_ECONOMIC_DATA: CountryData[] = [
  {
    name: "United States",
    code: "us",
    flag: "🇺🇸",
    gdp: { value: 27.36, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 2.5, change: 0.2, unit: "%", date: "Q4/23" },
    inflation: { value: 3.5, change: -0.2, unit: "%", date: "Mar/24" },
    interestRate: { value: 5.5, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 3.8, change: 0.1, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 123.3, unit: "%", date: "2023" },
    pmi: { value: 51.2, change: 0.8, unit: "points", date: "Apr/24" },
    exports: { value: 266.4, unit: "USD bn", date: "Feb/24" },
  },
  {
    name: "Eurozone",
    code: "eu",
    flag: "🇪🇺",
    gdp: { value: 14.52, unit: "EUR tn", date: "2023" },
    gdpGrowth: { value: 0.3, change: 0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 2.4, change: -0.1, unit: "%", date: "Mar/24" },
    interestRate: { value: 4.5, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 6.5, change: -0.1, unit: "%", date: "Feb/24" },
    debtToGdp: { value: 90.2, unit: "%", date: "2023" },
    pmi: { value: 51.5, change: 1.2, unit: "points", date: "Apr/24" },
    exports: { value: 211.3, unit: "EUR bn", date: "Feb/24" },
  },
  {
    name: "China",
    code: "cn",
    flag: "🇨🇳",
    gdp: { value: 17.8, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 5.3, change: 0.3, unit: "%", date: "Q1/24" },
    inflation: { value: 0.7, change: 0.4, unit: "%", date: "Mar/24" },
    interestRate: { value: 3.45, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 5.3, change: 0.1, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 77.8, unit: "%", date: "2023" },
    pmi: { value: 50.4, change: -0.2, unit: "points", date: "Apr/24" },
    exports: { value: 280.1, unit: "USD bn", date: "Mar/24" },
  },
  {
    name: "India",
    code: "in",
    flag: "🇮🇳",
    gdp: { value: 3.74, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 8.4, change: 0.6, unit: "%", date: "Q4/23" },
    inflation: { value: 4.9, change: -0.3, unit: "%", date: "Mar/24" },
    interestRate: { value: 6.5, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 8.1, change: 0.3, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 83.1, unit: "%", date: "2023" },
    pmi: { value: 59.1, change: 1.3, unit: "points", date: "Apr/24" },
    exports: { value: 41.4, unit: "USD bn", date: "Mar/24" },
  },
  {
    name: "Japan",
    code: "jp",
    flag: "🇯🇵",
    gdp: { value: 4.23, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 0.1, change: 0.3, unit: "%", date: "Q4/23" },
    inflation: { value: 2.5, change: -0.4, unit: "%", date: "Mar/24" },
    interestRate: { value: 0.1, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 2.6, change: 0, unit: "%", date: "Feb/24" },
    debtToGdp: { value: 261.9, unit: "%", date: "2023" },
    pmi: { value: 49.9, change: -0.2, unit: "points", date: "Apr/24" },
    exports: { value: 83.1, unit: "USD bn", date: "Mar/24" },
  },
  {
    name: "United Kingdom",
    code: "gb",
    flag: "🇬🇧",
    gdp: { value: 3.07, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 0.0, change: 0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 3.2, change: -0.8, unit: "%", date: "Mar/24" },
    interestRate: { value: 5.25, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 4.2, change: 0.1, unit: "%", date: "Feb/24" },
    debtToGdp: { value: 99.2, unit: "%", date: "2023" },
    pmi: { value: 49.9, change: -0.9, unit: "points", date: "Apr/24" },
    exports: { value: 46.2, unit: "GBP bn", date: "Feb/24" },
  },
  {
    name: "Germany",
    code: "de",
    flag: "🇩🇪",
    gdp: { value: 4.12, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: -0.3, change: -0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 2.2, change: -0.3, unit: "%", date: "Mar/24" },
    interestRate: { value: 4.5, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 5.9, change: 0.1, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 66.1, unit: "%", date: "2023" },
    pmi: { value: 42.5, change: -0.3, unit: "points", date: "Apr/24" },
    exports: { value: 136.7, unit: "EUR bn", date: "Feb/24" },
  },
  {
    name: "Australia",
    code: "au",
    flag: "🇦🇺",
    gdp: { value: 1.68, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 1.5, change: -0.1, unit: "%", date: "Q4/23" },
    inflation: { value: 3.6, change: -0.8, unit: "%", date: "Q1/24" },
    interestRate: { value: 4.35, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 3.8, change: 0, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 52.5, unit: "%", date: "2023" },
    pmi: { value: 47.3, change: -0.4, unit: "points", date: "Apr/24" },
    exports: { value: 43.9, unit: "AUD bn", date: "Feb/24" },
  },
  {
    name: "Canada",
    code: "ca",
    flag: "🇨🇦",
    gdp: { value: 2.14, unit: "USD tn", date: "2023" },
    gdpGrowth: { value: 0.2, change: -0.2, unit: "%", date: "Q4/23" },
    inflation: { value: 2.9, change: -0.1, unit: "%", date: "Mar/24" },
    interestRate: { value: 5.0, change: 0, unit: "%", date: "Apr/24" },
    unemployment: { value: 6.1, change: 0.2, unit: "%", date: "Mar/24" },
    debtToGdp: { value: 108.2, unit: "%", date: "2023" },
    pmi: { value: 49.8, change: 0.6, unit: "points", date: "Apr/24" },
    exports: { value: 57.1, unit: "CAD bn", date: "Feb/24" },
  },
];

const PRIORITY_INDICATORS = ["gdpGrowth", "inflation", "interestRate", "unemployment"];

const formatValue = (value: number, unit: string): string => {
  if (unit === "%") {
    return `${value.toFixed(1)}${unit}`;
  } else if (unit.includes("tn")) {
    return `${value.toFixed(2)} ${unit}`;
  } else if (unit.includes("bn")) {
    return `${value.toFixed(1)} ${unit}`;
  }
  return `${value} ${unit}`;
};

const EconomicIndicatorsDashboard = () => {
  const [economicData, setEconomicData] = useState<CountryData[]>(DEFAULT_ECONOMIC_DATA);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const updatedData = economicData.map(country => {
        const updatedCountry = { ...country } as CountryData;
        
        PRIORITY_INDICATORS.forEach(indicator => {
          const indicatorKey = indicator as keyof CountryData;
          if (updatedCountry[indicatorKey] && typeof updatedCountry[indicatorKey] !== 'string') {
            const indicatorData = updatedCountry[indicatorKey] as IndicatorValue;
            const oldValue = indicatorData.value;
            
            const randomChange = (Math.random() - 0.5) * 0.2;
            const newValue = Math.max(0, oldValue + randomChange);
            
            updatedCountry[indicatorKey] = {
              value: newValue,
              change: +(newValue - oldValue).toFixed(2),
              unit: indicatorData.unit,
              date: indicatorData.date
            };
            
            setRefreshing(prev => ({
              ...prev,
              [`${country.code}-${indicator}`]: true
            }));
          }
        });
        
        return updatedCountry;
      });
      
      setEconomicData(updatedData);
      setLastUpdated(new Date());
      
      setTimeout(() => {
        setRefreshing({});
      }, 2000);
    } catch (error) {
      console.error("Error fetching economic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Economic Indicators</CardTitle>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">GDP Growth</TableHead>
                <TableHead className="text-right">Inflation</TableHead>
                <TableHead className="text-right">Interest Rate</TableHead>
                <TableHead className="text-right">Unemployment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {economicData.map((country) => (
                <TableRow key={country.code}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell 
                    className={cn(
                      "text-right", 
                      refreshing[`${country.code}-gdpGrowth`] && "animate-pulse bg-muted/20",
                      country.gdpGrowth?.value! >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {country.gdpGrowth?.value! >= 0 ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                      {formatValue(country.gdpGrowth?.value || 0, country.gdpGrowth?.unit || "%")}
                      <span className="text-xs ml-1 text-muted-foreground">{country.gdpGrowth?.date}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell 
                    className={cn(
                      "text-right", 
                      refreshing[`${country.code}-inflation`] && "animate-pulse bg-muted/20",
                      country.inflation?.value! <= 2.5 ? "text-green-600" : 
                      country.inflation?.value! >= 5 ? "text-red-600" : "text-yellow-600"
                    )}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {formatValue(country.inflation?.value || 0, country.inflation?.unit || "%")}
                      <span className="text-xs ml-1 text-muted-foreground">{country.inflation?.date}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell 
                    className={cn(
                      "text-right", 
                      refreshing[`${country.code}-interestRate`] && "animate-pulse bg-muted/20"
                    )}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {formatValue(country.interestRate?.value || 0, country.interestRate?.unit || "%")}
                      <span className="text-xs ml-1 text-muted-foreground">{country.interestRate?.date}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell 
                    className={cn(
                      "text-right", 
                      refreshing[`${country.code}-unemployment`] && "animate-pulse bg-muted/20",
                      country.unemployment?.value! <= 4 ? "text-green-600" : 
                      country.unemployment?.value! >= 7 ? "text-red-600" : "text-yellow-600"
                    )}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {formatValue(country.unemployment?.value || 0, country.unemployment?.unit || "%")}
                      <span className="text-xs ml-1 text-muted-foreground">{country.unemployment?.date}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button asChild variant="outline" className="group">
            <Link to="/dashboard" className="flex items-center gap-2">
              View More Data
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicIndicatorsDashboard;
