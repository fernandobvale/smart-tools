import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Music, Receipt, UserSearch, FileText, FileEdit } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const tools = [
    {
      title: "Divisor de Texto",
      description: "Divida textos longos em partes menores",
      icon: <Scissors className="w-6 h-6" />,
      href: "/text-splitter"
    },
    {
      title: "Conversor de Vídeo para Áudio",
      description: "Extraia o áudio de seus vídeos MP4",
      icon: <Music className="w-6 h-6" />,
      href: "/video-to-audio"
    },
    {
      title: "Sistema de Recibos",
      description: "Gere e gerencie recibos facilmente",
      icon: <Receipt className="w-6 h-6" />,
      href: "/receipts"
    },
    {
      title: "Consulta CPF",
      description: "Consulte dados de CPF e veja histórico",
      icon: <UserSearch className="w-6 h-6" />,
      href: "/cpf-consulta"
    },
    {
      title: "Gerador de SEO",
      description: "Gere descrições otimizadas para SEO utilizando IA",
      icon: <FileText className="w-6 h-6" />,
      href: "/seo-generator"
    },
    {
      title: "Editor Markdown",
      description: "Edite e visualize textos em Markdown em tempo real",
      icon: <FileEdit className="w-6 h-6" />,
      href: "/markdown-editor"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold md:text-left text-center mt-14 md:mt-0">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.href} className="block h-full">
            <Card className="h-full hover:bg-accent transition-colors">
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