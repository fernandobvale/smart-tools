import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BudgetData {
  faturamento: string;
  impostoPerc: string;
  impostoRs: string;
  pessoasPerc: string;
  pessoasRs: string;
  opexPerc: string;
  opexRs: string;
  capexPerc: string;
  capexRs: string;
  investPerc: string;
  investRs: string;
  dv8Perc: string;
  dv8Rs: string;
  lucroPerc: string;
  lucroRs: string;
}

interface BudgetTableProps {
  data: BudgetData;
}

export function BudgetTable({ data }: BudgetTableProps) {
  return (
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
          <TableCell className="font-medium text-[#6E59A5]">{data.faturamento}</TableCell>
          <TableCell>100%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Impostos</TableCell>
          <TableCell className="text-[#7E69AB]">{data.impostoRs}</TableCell>
          <TableCell>{data.impostoPerc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Pessoas</TableCell>
          <TableCell className="text-[#7E69AB]">{data.pessoasRs}</TableCell>
          <TableCell>{data.pessoasPerc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">OPEX</TableCell>
          <TableCell className="text-[#7E69AB]">{data.opexRs}</TableCell>
          <TableCell>{data.opexPerc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">CAPEX</TableCell>
          <TableCell className="text-[#7E69AB]">{data.capexRs}</TableCell>
          <TableCell>{data.capexPerc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Investimentos</TableCell>
          <TableCell className="text-[#7E69AB]">{data.investRs}</TableCell>
          <TableCell>{data.investPerc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">DV8</TableCell>
          <TableCell className="text-[#7E69AB]">{data.dv8Rs}</TableCell>
          <TableCell>{data.dv8Perc}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Lucro</TableCell>
          <TableCell className="font-medium text-[#6E59A5]">{data.lucroRs}</TableCell>
          <TableCell>{data.lucroPerc}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}