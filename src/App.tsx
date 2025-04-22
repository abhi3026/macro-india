import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

// Import pages directly
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import DataDashboardPage from "@/pages/DataDashboardPage";
import EducationPage from "@/pages/EducationPage";
import ResearchPage from "@/pages/ResearchPage";
import NewsPage from "@/pages/NewsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import SearchPage from "@/pages/SearchPage";
import MarketsPage from "@/pages/MarketsPage";
import EconomicIndicatorsPage from "@/pages/EconomicIndicatorsPage";
import InterestRatesPage from "@/pages/InterestRatesPage";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" attribute="class">
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/data-dashboard" element={<DataDashboardPage />} />
                <Route path="/data-dashboard/markets" element={<MarketsPage />} />
                <Route path="/data-dashboard/economic-indicators" element={<EconomicIndicatorsPage />} />
                <Route path="/data-dashboard/interest-rates-bonds" element={<InterestRatesPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
