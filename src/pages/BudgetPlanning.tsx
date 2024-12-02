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
  const forecastData = {
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
  };

  return (
    <div className="container mx-auto p-6">
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
        <CardContent>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-primary bg-[#9b87f5]/10">Indicador</TableHead>
                  <TableHead className="font-semibold text-primary bg-[#9b87f5]/10">Valor</TableHead>
                  <TableHead className="font-semibold text-primary bg-[#9b87f5]/10">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Faturamento</TableCell>
                  <TableCell className="font-medium text-[#6E59A5]">{forecastData.faturamento}</TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Impostos</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.impostoRs}</TableCell>
                  <TableCell>{forecastData.impostoPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pessoas</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.pessoasRs}</TableCell>
                  <TableCell>{forecastData.pessoasPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">OPEX</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.opexRs}</TableCell>
                  <TableCell>{forecastData.opexPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CAPEX</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.capexRs}</TableCell>
                  <TableCell>{forecastData.capexPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Investimentos</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.investRs}</TableCell>
                  <TableCell>{forecastData.investPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">DV8</TableCell>
                  <TableCell className="text-[#7E69AB]">{forecastData.dv8Rs}</TableCell>
                  <TableCell>{forecastData.dv8Perc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lucro</TableCell>
                  <TableCell className="font-medium text-[#6E59A5]">{forecastData.lucroRs}</TableCell>
                  <TableCell>{forecastData.lucroPerc}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}