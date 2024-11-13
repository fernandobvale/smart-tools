import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CpfSearchHistory {
  id: string;
  cpf: string;
  nome: string;
  created_at: string;
}

const CpfConsulta = () => {
  const [cpf, setCpf] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf.slice(0, 14));
  };

  const consultarCpf = async () => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      throw new Error("CPF inválido");
    }

    const response = await fetch(
      `https://api.cpfcnpj.com.br/20de1bc83f2eca1e15930428f621e5a5/1/${cleanCpf}`
    );

    if (!response.ok) {
      throw new Error("Erro ao consultar CPF");
    }

    const data = await response.json();
    
    // Save to history
    await supabase.from("cpf_searches").insert({
      cpf: cleanCpf,
      nome: data.nome,
    });

    return data;
  };

  const { data: cpfData, isLoading: isLoadingCpf } = useQuery({
    queryKey: ["cpf", cpf],
    queryFn: consultarCpf,
    enabled: false,
    retry: false,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: `CPF encontrado: ${data.nome}`,
      });
    },
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["cpf-history", searchTerm, currentPage],
    queryFn: async () => {
      const query = supabase
        .from("cpf_searches")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query.or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (error) throw error;

      return {
        items: data as CpfSearchHistory[],
        total: count || 0,
      };
    },
  });

  const totalPages = Math.ceil((historyData?.total || 0) / 10);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Consulta de CPF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Digite o CPF"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className="flex-1"
            />
            <Button
              onClick={() => consultarCpf()}
              disabled={isLoadingCpf}
              className="w-full sm:w-auto"
            >
              {isLoadingCpf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                "Consultar"
              )}
            </Button>
          </div>

          {cpfData && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Nome: {cpfData.nome}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Histórico de Consultas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por CPF ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data da Consulta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : (
                  historyData?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatCPF(item.cpf)}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CpfConsulta;