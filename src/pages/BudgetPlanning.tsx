import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BudgetPlanning() {
  return (
    <div className="space-y-6 px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Plano Orçamentário</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seu orçamento
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Em desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta funcionalidade está em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}