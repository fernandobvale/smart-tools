import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScissorsLinear } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const tools = [
    {
      title: "Divisor de Texto",
      description: "Divida textos longos em partes menores",
      icon: <ScissorsLinear className="w-6 h-6" />,
      href: "/text-splitter"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.href}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
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