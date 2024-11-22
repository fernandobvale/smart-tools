import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Scissors,
  Receipt,
  UserSearch,
  FileText,
  FileEdit,
  StickyNote,
  GraduationCap,
  MessageSquare,
  Sparkles,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    title: "Divisor de Texto",
    href: "/text-splitter",
    icon: <Scissors className="w-4 h-4" />,
  },
  {
    title: "Recibos",
    href: "/receipts",
    icon: <Receipt className="w-4 h-4" />,
  },
  {
    title: "Consulta CPF",
    href: "/cpf-consulta",
    icon: <UserSearch className="w-4 h-4" />,
  },
  {
    title: "Gerador de SEO",
    href: "/seo-generator",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    title: "Editor Markdown",
    href: "/markdown-editor",
    icon: <FileEdit className="w-4 h-4" />,
  },
  {
    title: "Notas",
    href: "/notes",
    icon: <StickyNote className="w-4 h-4" />,
  },
  {
    title: "Gestão de Certificados",
    href: "/certificates/manage",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    title: "Lista de Professores",
    href: "/teacher-list",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    title: "Lista de Prompts",
    href: "/prompt-list",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    title: "Pagamento Editores",
    href: "/courses",
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  location.pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-lg transition text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}