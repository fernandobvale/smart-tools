import { useState } from 'react';
import {
  BarChart3,
  FileText,
  Receipt,
  Search,
  Globe,
  Edit,
  StickyNote,
  Award,
  Users,
  MessageSquare,
  List,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Database
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Dividir Texto', href: '/text-splitter', icon: FileText },
  { name: 'Recibos', href: '/receipts', icon: Receipt },
  { name: 'Consulta CPF', href: '/cpf-consulta', icon: Search },
  { name: 'Gerador SEO', href: '/seo-generator', icon: Globe },
  { name: 'Editor Markdown', href: '/markdown-editor', icon: Edit },
  { name: 'Notas', href: '/notes', icon: StickyNote },
  { name: 'Certificados', href: '/certificates/manage', icon: Award },
  { name: 'Lista de Professores', href: '/teacher-list', icon: Users },
  { name: 'Gerador de Prompts', href: '/prompt-generator', icon: MessageSquare },
  { name: 'Lista de Prompts', href: '/prompt-list', icon: List },
  { name: 'Gerenciar Cursos', href: '/courses', icon: BookOpen },
  { name: 'Reclamações de Curso', href: '/reclamacoes-curso', icon: AlertTriangle },
  { name: 'Sugestões de Curso', href: '/sugestoes-curso', icon: Lightbulb },
  { name: 'Supabase', href: '/supabase', icon: Database },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-lg font-semibold">Painel</span>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-4">
            {navigation.map((item: NavItem) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <button className="p-2 hover:bg-gray-200 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Painel</SheetTitle>
          </SheetHeader>
          <Separator />
          <ScrollArea className="flex-1">
            <nav className="p-4">
              {navigation.map((item: NavItem) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
