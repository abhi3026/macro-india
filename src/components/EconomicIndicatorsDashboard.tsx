
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { EconomicTable, EconomicData } from "@/components/ui/economic-table";

// Complete dataset with all countries
const economicData: EconomicData[] = [
  {
    flag: "/flags/in.svg",
    country: "India",
    gdp: 3750.5,
    gdpGrowth: 6.7,
    pmi: 52.5,
    unemployment: 7.5,
    inflation: 5.4,
    exports: 450.2,
    businessConfidence: 51.8,
    consumerConfidence: 83.2
  },
  {
    flag: "/flags/us.svg",
    country: "USA",
    gdp: 25400.3,
    gdpGrowth: 2.4,
    pmi: 51.9,
    unemployment: 3.8,
    inflation: 3.1,
    exports: 2550.5,
    businessConfidence: 52.5,
    consumerConfidence: 67.8
  },
  {
    flag: "/flags/cn.svg",
    country: "China",
    gdp: 19000.2,
    gdpGrowth: 4.9,
    pmi: 50.2,
    unemployment: 5.1,
    inflation: 0.5,
    exports: 3350.8,
    businessConfidence: 49.8,
    consumerConfidence: 89.5
  },
  {
    flag: "/flags/jp.svg",
    country: "Japan",
    gdp: 5150.8,
    gdpGrowth: 0.8,
    pmi: 48.5,
    unemployment: 2.6,
    inflation: 2.8,
    exports: 750.3,
    businessConfidence: 45.2,
    consumerConfidence: 33.9
  },
  {
    flag: "/flags/de.svg",
    country: "Germany",
    gdp: 4250.5,
    gdpGrowth: 0.2,
    pmi: 45.8,
    unemployment: 5.8,
    inflation: 2.9,
    exports: 1780.5,
    businessConfidence: 43.5,
    consumerConfidence: 41.2
  },
  {
    flag: "/flags/uk.svg",
    country: "UK",
    gdp: 3250.7,
    gdpGrowth: 0.6,
    pmi: 49.2,
    unemployment: 4.2,
    inflation: 3.8,
    exports: 680.2,
    businessConfidence: 48.9,
    consumerConfidence: 47.5
  },
  {
    flag: "/flags/fr.svg",
    country: "France",
    gdp: 3000.2,
    gdpGrowth: 0.5,
    pmi: 47.8,
    unemployment: 7.1,
    inflation: 2.6,
    exports: 720.5,
    businessConfidence: 46.2,
    consumerConfidence: 45.0
  },
  {
    flag: "/flags/br.svg",
    country: "Brazil",
    gdp: 2150.8,
    gdpGrowth: 2.1,
    pmi: 52.8,
    unemployment: 7.8,
    inflation: 4.8,
    exports: 320.5,
    businessConfidence: 53.5,
    consumerConfidence: 65.2
  },
  {
    flag: "/flags/ru.svg",
    country: "Russia",
    gdp: 2100.5,
    gdpGrowth: 1.2,
    pmi: 49.5,
    unemployment: 3.9,
    inflation: 7.2,
    exports: 420.8,
    businessConfidence: 47.8,
    consumerConfidence: 68.5
  },
  {
    flag: "/flags/za.svg",
    country: "South Africa",
    gdp: 420.5,
    gdpGrowth: 0.8,
    pmi: 48.7,
    unemployment: 32.9,
    inflation: 5.4,
    exports: 120.2,
    businessConfidence: 42.5,
    consumerConfidence: 38.7
  },
  {
    flag: "/flags/au.svg",
    country: "Australia",
    gdp: 1750.8,
    gdpGrowth: 1.9,
    pmi: 51.5,
    unemployment: 4.1,
    inflation: 3.8,
    exports: 310.5,
    businessConfidence: 48.7,
    consumerConfidence: 85.2
  },
  {
    flag: "/flags/ca.svg",
    country: "Canada",
    gdp: 2150.2,
    gdpGrowth: 1.4,
    pmi: 50.2,
    unemployment: 5.7,
    inflation: 3.4,
    exports: 480.5,
    businessConfidence: 49.5,
    consumerConfidence: 58.2
  },
  {
    flag: "/flags/sg.svg",
    country: "Singapore",
    gdp: 420.5,
    gdpGrowth: 2.4,
    pmi: 51.2,
    unemployment: 2.1,
    inflation: 2.8,
    exports: 510.8,
    businessConfidence: 54.2,
    consumerConfidence: 95.4
  },
  {
    flag: "/flags/kr.svg",
    country: "South Korea",
    gdp: 1850.2,
    gdpGrowth: 2.2,
    pmi: 50.1,
    unemployment: 2.8,
    inflation: 2.1,
    exports: 650.4,
    businessConfidence: 52.1,
    consumerConfidence: 87.5
  },
  {
    flag: "/flags/id.svg",
    country: "Indonesia",
    gdp: 1380.5,
    gdpGrowth: 5.0,
    pmi: 52.3,
    unemployment: 5.4,
    inflation: 3.4,
    exports: 220.5,
    businessConfidence: 51.8,
    consumerConfidence: 78.5
  }
];

const EconomicIndicatorsDashboard = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-accent1" />
          Economic Indicators Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EconomicTable data={economicData} />
      </CardContent>
    </Card>
  );
};

export default EconomicIndicatorsDashboard;
