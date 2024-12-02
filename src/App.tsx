import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Receipts from "./pages/Receipts";
import ReceiptForm from "./components/receipts/ReceiptForm";
import CpfConsulta from "./pages/CpfConsulta";
import SeoGenerator from "./pages/SeoGenerator";
import MarkdownEditor from "./pages/MarkdownEditor";
import Notes from "./pages/Notes";
import CertificateForm from "./pages/Certificates/CertificateForm";
import CertificateSuccess from "./pages/Certificates/CertificateSuccess";
import CertificateManagement from "./pages/Certificates/CertificateManagement";
import TeacherApplication from "./pages/TeacherApplication";
import TeacherList from "./pages/TeacherList";
import PromptGenerator from "./pages/PromptGenerator";
import PromptList from "./pages/PromptList";
import CourseManagement from "./pages/CourseManagement";
import BudgetPlanning from "./pages/BudgetPlanning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Rotas públicas */}
                <Route path="/certificates/new" element={<CertificateForm />} />
                <Route path="/certificates/success" element={<CertificateSuccess />} />
                <Route path="/teacher-application" element={<TeacherApplication />} />
                {/* Rotas protegidas */}
                <Route
                  element={
                    <RequireAuth>
                      <DashboardLayout />
                    </RequireAuth>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/text-splitter" element={<Index />} />
                  <Route path="/receipts" element={<Receipts />} />
                  <Route path="/receipts/new/:payeeId" element={<ReceiptForm />} />
                  <Route path="/cpf-consulta" element={<CpfConsulta />} />
                  <Route path="/seo-generator" element={<SeoGenerator />} />
                  <Route path="/markdown-editor" element={<MarkdownEditor />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/certificates/manage" element={<CertificateManagement />} />
                  <Route path="/teacher-list" element={<TeacherList />} />
                  <Route path="/prompt-generator" element={<PromptGenerator />} />
                  <Route path="/prompt-list" element={<PromptList />} />
                  <Route path="/courses" element={<CourseManagement />} />
                  <Route path="/budget-planning" element={<BudgetPlanning />} />
                </Route>
                {/* Rota 404 - deve ser a última */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;