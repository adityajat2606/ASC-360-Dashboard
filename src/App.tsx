import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import AssignCoversPage from "@/pages/AssignCoversPage";
import WalletPage from "@/pages/WalletPage";
import PaymentsPage from "@/pages/PaymentsPage";
import PolicyIssuedPage from "@/pages/PolicyIssuedPage";
import SingleIssuancePage from "@/pages/SingleIssuancePage";
import BulkIssuancePage from "@/pages/BulkIssuancePage";
import QuoteLinksPage from "@/pages/QuoteLinksPage";
import OperatorProfilePage from "@/pages/OperatorProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/assign-covers" element={<AssignCoversPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/policy-issued" element={<PolicyIssuedPage />} />
            <Route path="/issuance/single" element={<SingleIssuancePage />} />
            <Route path="/issuance/bulk" element={<BulkIssuancePage />} />
            <Route path="/issuance/quote-links" element={<QuoteLinksPage />} />
            <Route path="/operator-profile" element={<OperatorProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
