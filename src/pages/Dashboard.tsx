import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const tools = [
    {
      title: "Divisor de Texto",
      description: "Divida textos longos em partes menores",
      icon: <Scissors className="w-6 h-6 text-[#9b87f5]" />,
      href: "/text-splitter"
    },
    {
      title: "Sistema de Recibos",
      description: "Gere e gerencie recibos facilmente",
      icon: <Receipt className="w-6 h-6 text-[#6E59A5]" />,
      href: "/receipts"
    },
    {
      title: "Consulta CPF",
      description: "Consulte dados de CPF e veja histórico",
      icon: <UserSearch className="w-6 h-6 text-[#9b87f5]" />,
      href: "/cpf-consulta"
    },
    {
      title: "Gerador de SEO",
      description: "Gere descrições otimizadas para SEO utilizando IA",
      icon: <FileText className="w-6 h-6 text-[#7E69AB]" />,
      href: "/seo-generator"
    },
    {
      title: "Editor Markdown",
      description: "Edite e visualize textos em Markdown em tempo real",
      icon: <FileEdit className="w-6 h-6 text-[#6E59A5]" />,
      href: "/markdown-editor"
    },
    {
      title: "Notas",
      description: "Crie e gerencie suas notas com um editor rico",
      icon: <StickyNote className="w-6 h-6 text-[#9b87f5]" />,
      href: "/notes"
    },
    {
      title: "Gestão de Certificados",
      description: "Gerencie e acompanhe o envio de certificados",
      icon: <FileText className="w-6 h-6 text-[#7E69AB]" />,
      href: "/certificates/manage"
    },
    {
      title: "Lista de Professores",
      description: "Gerencie e visualize inscrições de professores",
      icon: <GraduationCap className="w-6 h-6 text-[#6E59A5]" />,
      href: "/teacher-list"
    },
    {
      title: "Lista de Prompts",
      description: "Visualize e gerencie prompts personalizados",
      icon: <MessageSquare className="w-6 h-6 text-[#9b87f5]" />,
      href: "/prompt-list"
    },
    {
      title: "Pagamento Editores",
      description: "Gerencie pagamentos de aulas editadas",
      icon: <BookOpen className="w-6 h-6 text-[#7E69AB]" />,
      href: "/courses"
    },
    {
      title: "Plano Orçamentário",
      description: "Gerencie e acompanhe seu orçamento",
      icon: <BarChart2 className="w-6 h-6 text-[#6E59A5]" />,
      href: "/budget-planning"
    }
  ];

  return (
    <div className="space-y-6 px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            Dashboard
            <Sparkles className="w-6 h-6 text-[#9b87f5]" />
          </h1>
          <p className="text-muted-foreground">
            Selecione uma ferramenta para começar
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.href} className="block h-full">
            <Card className="h-full hover:bg-accent/50 transition-colors border-2 hover:border-[#9b87f5]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  {tool.title}
                </CardTitle>
                {tool.icon}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}