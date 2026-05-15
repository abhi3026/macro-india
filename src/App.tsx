import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import DataDashboardPage from "@/pages/DataDashboardPage";
import EducationPage from "@/pages/EducationPage";
import ResearchPage from "@/pages/ResearchPage";
import NewsPage from "@/pages/NewsPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import SearchPage from "@/pages/SearchPage";
import EconomicIndicatorsPage from "@/pages/EconomicIndicatorsPage";
import InterestRatesPage from "@/pages/InterestRatesPage";
import AuthPage from "@/pages/AuthPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EducationCMS from "@/pages/admin/EducationCMS";
import ResearchAdminCMS from "@/pages/admin/ResearchAdminCMS";
import IndicatorsCMS from "@/pages/admin/IndicatorsCMS";
import WeeklyReadCMS from "@/pages/admin/WeeklyReadCMS";
import UsersCMS from "@/pages/admin/UsersCMS";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="indianmacro-theme">
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/data-dashboard" element={<DataDashboardPage />} />
                <Route path="/data-dashboard/economic-indicators" element={<EconomicIndicatorsPage />} />
                <Route path="/data-dashboard/interest-rates-bonds" element={<InterestRatesPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="education" element={<EducationCMS />} />
                  <Route path="research" element={<ResearchAdminCMS />} />
                  <Route path="indicators" element={<IndicatorsCMS />} />
                  <Route path="weekly" element={<WeeklyReadCMS />} />
                  <Route path="users" element={<ProtectedAdminRoute requireManage><UsersCMS /></ProtectedAdminRoute>} />
                </Route>
              </Routes>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}

export default App;
