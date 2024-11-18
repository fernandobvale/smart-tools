import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import CertificateManagement from "@/pages/Certificates/CertificateManagement";
import CertificateForm from "@/pages/Certificates/CertificateForm";
import TeacherApplication from "@/pages/TeacherApplication";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/certificates/manage",
    element: <CertificateManagement />,
  },
  {
    path: "/certificates/new",
    element: <CertificateForm />,
  },
  {
    path: "/teacher-application",
    element: <TeacherApplication />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
