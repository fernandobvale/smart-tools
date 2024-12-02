import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2 } from "lucide-react";

export default function BudgetPlanning() {
  const forecastData = [
    {
      mesAno: "12/23",
      faturamento: "R$ 212.643,31",
      impostoPerc: "8,35%",
      impostoRs: "R$ 17.748,90",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 37.550,30",
      opexPerc: "8,71%",
      opexRs: "R$ 18.520,98",
      capexPerc: "26,49%",
      capexRs: "R$ 56.334,96",
      investPerc: "26,12%",
      investRs: "R$ 55.542,46",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 21.264,33",
      lucroPerc: "11,02%",
      lucroRs: "R$ 23.430,28",
    },
    // ... outros meses podem ser adicionados aqui
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8 text-[#9b87f5]" />
            <div>
              <CardTitle className="text-2xl font-bold">Plano Orçamentário</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Forecast Anual - 2024
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">Mês/Ano</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">Faturamento</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">IMPOSTO %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">IMPOSTO R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">PESSOAS %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">PESSOAS R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">OPEX %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">OPEX R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">CAPEX %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">CAPEX R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">INVEST %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">INVEST R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">DV8 %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">DV8 R$</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">LUCRO %</TableHead>
                    <TableHead className="font-semibold text-primary h-12 px-4 bg-[#9b87f5]/10">LUCRO R$</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastData.map((row, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{row.mesAno}</TableCell>
                      <TableCell className="font-medium text-[#6E59A5]">{row.faturamento}</TableCell>
                      <TableCell>{row.impostoPerc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.impostoRs}</TableCell>
                      <TableCell>{row.pessoasPerc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.pessoasRs}</TableCell>
                      <TableCell>{row.opexPerc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.opexRs}</TableCell>
                      <TableCell>{row.capexPerc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.capexRs}</TableCell>
                      <TableCell>{row.investPerc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.investRs}</TableCell>
                      <TableCell>{row.dv8Perc}</TableCell>
                      <TableCell className="text-[#7E69AB]">{row.dv8Rs}</TableCell>
                      <TableCell className="font-medium">{row.lucroPerc}</TableCell>
                      <TableCell className="font-medium text-[#6E59A5]">{row.lucroRs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}