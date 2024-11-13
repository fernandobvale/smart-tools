import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import CpfInput from "@/components/cpf-consulta/CpfInput";
import SearchHistory from "@/components/cpf-consulta/SearchHistory";
import CustomPagination from "@/components/cpf-consulta/CustomPagination";
import { validateCPF } from "@/lib/cpf-utils";

const CpfConsulta = () => {
  const [cpf, setCpf] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const consultarCpf = async () => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (!validateCPF(cleanCpf)) {
      throw new Error("CPF inválido");
    }

    const response = await fetch(
      `https://api.cpfcnpj.com.br/20de1bc83f2eca1e15930428f621e5a5/1/${cleanCpf}`
    );

    if (!response.ok) {
      throw new Error("Erro ao consultar CPF");
    }

    const data = await response.json();
    
    await supabase
      .from("cpf_searches")
      .insert({
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
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: `CPF encontrado: ${data.nome}`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    },
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["cpf-history", searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("cpf_searches")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (error) throw error;

      return {
        items: data,
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
            <CpfInput cpf={cpf} onChange={setCpf} />
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

          <SearchHistory
            data={historyData?.items || []}
            isLoading={isLoadingHistory}
          />

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CpfConsulta;