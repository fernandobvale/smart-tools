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
    <div className="space-y-6 px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Plano Orçamentário</h1>
          <p className="text-muted-foreground">
            Forecast Anual - 2024
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Mês/Ano</TableHead>
              <TableHead className="font-semibold">Faturamento</TableHead>
              <TableHead className="font-semibold">IMPOSTO %</TableHead>
              <TableHead className="font-semibold">IMPOSTO R$</TableHead>
              <TableHead className="font-semibold">PESSOAS %</TableHead>
              <TableHead className="font-semibold">PESSOAS R$</TableHead>
              <TableHead className="font-semibold">OPEX %</TableHead>
              <TableHead className="font-semibold">OPEX R$</TableHead>
              <TableHead className="font-semibold">CAPEX %</TableHead>
              <TableHead className="font-semibold">CAPEX R$</TableHead>
              <TableHead className="font-semibold">INVEST %</TableHead>
              <TableHead className="font-semibold">INVEST R$</TableHead>
              <TableHead className="font-semibold">DV8 %</TableHead>
              <TableHead className="font-semibold">DV8 R$</TableHead>
              <TableHead className="font-semibold">LUCRO %</TableHead>
              <TableHead className="font-semibold">LUCRO R$</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecastData.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell>{row.mesAno}</TableCell>
                <TableCell>{row.faturamento}</TableCell>
                <TableCell>{row.impostoPerc}</TableCell>
                <TableCell>{row.impostoRs}</TableCell>
                <TableCell>{row.pessoasPerc}</TableCell>
                <TableCell>{row.pessoasRs}</TableCell>
                <TableCell>{row.opexPerc}</TableCell>
                <TableCell>{row.opexRs}</TableCell>
                <TableCell>{row.capexPerc}</TableCell>
                <TableCell>{row.capexRs}</TableCell>
                <TableCell>{row.investPerc}</TableCell>
                <TableCell>{row.investRs}</TableCell>
                <TableCell>{row.dv8Perc}</TableCell>
                <TableCell>{row.dv8Rs}</TableCell>
                <TableCell>{row.lucroPerc}</TableCell>
                <TableCell>{row.lucroRs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}