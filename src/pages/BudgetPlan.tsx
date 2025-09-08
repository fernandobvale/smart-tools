import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, PieChart, Calendar } from "lucide-react";

const BudgetPlan = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano Orçamentário</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seu planejamento financeiro
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumo Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">
              Total planejado para este período
            </p>
            <Badge variant="secondary" className="mt-2">
              Em desenvolvimento
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Categorias de orçamento definidas
            </p>
            <Badge variant="secondary" className="mt-2">
              Em desenvolvimento
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período Atual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Período de planejamento ativo
            </p>
            <Badge variant="secondary" className="mt-2">
              Em desenvolvimento
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Funcionalidades que serão implementadas para o plano orçamentário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium">Criação de Categorias</h4>
                <p className="text-sm text-muted-foreground">
                  Definir categorias de receitas e despesas personalizadas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium">Lançamentos</h4>
                <p className="text-sm text-muted-foreground">
                  Registrar receitas e despesas planejadas e realizadas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium">Relatórios e Gráficos</h4>
                <p className="text-sm text-muted-foreground">
                  Visualizar dados através de gráficos e relatórios detalhados
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium">Metas e Alertas</h4>
                <p className="text-sm text-muted-foreground">
                  Definir metas orçamentárias e receber alertas de gastos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlan;