
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  FileText, 
  Calculator, 
  Search,
  Globe,
  Edit3,
  StickyNote,
  Award,
  Users,
  Lightbulb,
  List,
  GraduationCap,
  MessageSquare,
  Database,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const DashboardLayout = () => {
  const { signOut } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: User, path: "/dashboard" },
    { id: "text-splitter", label: "Quebrador de Texto", icon: FileText, path: "/text-splitter" },
    { id: "receipts", label: "Recibos", icon: Calculator, path: "/receipts" },
    { id: "cpf-consulta", label: "Consulta CPF", icon: Search, path: "/cpf-consulta" },
    { id: "seo-generator", label: "Gerador SEO", icon: Globe, path: "/seo-generator" },
    { id: "markdown-editor", label: "Editor Markdown", icon: Edit3, path: "/markdown-editor" },
    { id: "notes", label: "Notas", icon: StickyNote, path: "/notes" },
    { id: "certificates", label: "Certificados", icon: Award, path: "/certificates/manage" },
    { id: "teacher-list", label: "Lista de Professores", icon: Users, path: "/teacher-list" },
    { id: "prompt-generator", label: "Gerador de Prompts", icon: Lightbulb, path: "/prompt-generator" },
    { id: "prompt-list", label: "Lista de Prompts", icon: List, path: "/prompt-list" },
    { id: "courses", label: "Pagamento de Editores", icon: GraduationCap, path: "/courses" },
    { id: "reclamacoes-curso", label: "Reclamações de Cursos", icon: AlertTriangle, path: "/reclamacoes-curso" },
    { id: "sugestoes-curso", label: "Sugestões de Curso", icon: MessageSquare, path: "/sugestoes-curso" },
    { id: "plano-orcamentario", label: "Plano Orçamentário", icon: BarChart3, path: "/plano-orcamentario" },
    { id: "supabase", label: "Supabase Projects", icon: Database, path: "/supabase" },
  ];

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <Separator />
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                      isActive ? "bg-secondary text-secondary-foreground" : ""
                    }
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </NavLink>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
