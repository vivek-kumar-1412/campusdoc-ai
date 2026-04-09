import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, useDocuments, useTemplates } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateDocumentPage from "@/pages/CreateDocumentPage";
import MyDocumentsPage from "@/pages/MyDocumentsPage";
import TemplatesPage from "@/pages/TemplatesPage";
import HistoryPage from "@/pages/HistoryPage";
import LegalAnalysisPage from "@/pages/LegalAnalysisPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, login, logout } = useAuth();
  const { documents, addDocument, updateDocument } = useDocuments();
  const { templates, addTemplate } = useTemplates();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage onLogin={login} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout user={user} onLogout={logout} />}>
        <Route path="/dashboard" element={<DashboardPage user={user} documents={documents} />} />
        <Route path="/create" element={<CreateDocumentPage onSave={addDocument} templates={templates} />} />
        <Route path="/documents" element={<MyDocumentsPage documents={documents} user={user} onUpdate={updateDocument} />} />
        <Route path="/templates" element={<TemplatesPage templates={templates} onAddTemplate={addTemplate} />} />
        <Route path="/history" element={<HistoryPage documents={documents} />} />
        <Route path="/analysis" element={<LegalAnalysisPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
