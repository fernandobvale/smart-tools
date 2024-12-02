import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BudgetPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState("12/23");
  const [viewType, setViewType] = useState<"monthly" | "annual">("monthly");

  const forecastData = {
    "12/23": {
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
    "01/24": {
      faturamento: "R$ 220.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 18.370,00",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 38.852,00",
      opexPerc: "8,71%",
      opexRs: "R$ 19.162,00",
      capexPerc: "26,49%",
      capexRs: "R$ 58.278,00",
      investPerc: "26,12%",
      investRs: "R$ 57.464,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 22.000,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 24.244,00",
    },
    "02/24": {
      faturamento: "R$ 225.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 18.787,50",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 39.735,00",
      opexPerc: "8,71%",
      opexRs: "R$ 19.597,50",
      capexPerc: "26,49%",
      capexRs: "R$ 59.602,50",
      investPerc: "26,12%",
      investRs: "R$ 58.770,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 22.500,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 24.795,00",
    },
    "2024": {
      faturamento: "R$ 2.640.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 220.440,00",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 466.224,00",
      opexPerc: "8,71%",
      opexRs: "R$ 229.944,00",
      capexPerc: "26,49%",
      capexRs: "R$ 699.336,00",
      investPerc: "26,12%",
      investRs: "R$ 689.568,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 264.000,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 290.928,00",
    },
  };

  const currentData = forecastData[selectedPeriod];

  return (
    <div className="container mx-auto p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-8 w-8 text-[#9b87f5]" />
              <div>
                <CardTitle className="text-2xl font-bold">Plano Orçamentário</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Forecast {viewType === "annual" ? "Anual" : "Mensal"} - 2024
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={viewType} onValueChange={(value: "monthly" | "annual") => {
                setViewType(value);
                if (value === "annual") {
                  setSelectedPeriod("2024");
                } else {
                  setSelectedPeriod("12/23");
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione a visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Visualização Mensal</SelectItem>
                  <SelectItem value="annual">Visualização Anual</SelectItem>
                </SelectContent>
              </Select>
              
              {viewType === "monthly" && (
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12/23">Dezembro/2023</SelectItem>
                    <SelectItem value="01/24">Janeiro/2024</SelectItem>
                    <SelectItem value="02/24">Fevereiro/2024</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
                  <TableCell className="font-medium text-[#6E59A5]">{currentData.faturamento}</TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Impostos</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.impostoRs}</TableCell>
                  <TableCell>{currentData.impostoPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pessoas</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.pessoasRs}</TableCell>
                  <TableCell>{currentData.pessoasPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">OPEX</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.opexRs}</TableCell>
                  <TableCell>{currentData.opexPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CAPEX</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.capexRs}</TableCell>
                  <TableCell>{currentData.capexPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Investimentos</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.investRs}</TableCell>
                  <TableCell>{currentData.investPerc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">DV8</TableCell>
                  <TableCell className="text-[#7E69AB]">{currentData.dv8Rs}</TableCell>
                  <TableCell>{currentData.dv8Perc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lucro</TableCell>
                  <TableCell className="font-medium text-[#6E59A5]">{currentData.lucroRs}</TableCell>
                  <TableCell>{currentData.lucroPerc}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}