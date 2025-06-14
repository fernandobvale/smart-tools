import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useAuth } from "@/components/auth/AuthProvider";

const CpfConsulta = () => {
  const [cpf, setCpf] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const consultarCpf = async () => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (!validateCPF(cleanCpf)) {
      throw new Error("CPF inválido. Por favor, insira um CPF válido com 11 dígitos.");
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
        saldo: data.saldo,
        user_id: user?.id, // garante o user_id correto
      });

    queryClient.invalidateQueries({ queryKey: ["cpf-history"] });

    return data;
  };

  const { data: cpfData, isLoading: isLoadingCpf, refetch } = useQuery({
    queryKey: ["cpf", cpf],
    queryFn: consultarCpf,
    enabled: false,
    retry: false,
  });

  const handleSuccess = (data: any) => {
    toast({
      title: "Sucesso",
      description: `CPF encontrado: ${data.nome}`,
    });
  };

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Erro",
      description: error.message,
    });
  };

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

  const handleConsulta = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        handleSuccess(result.data);
      }
      if (result.error) {
        handleError(result.error);
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const totalPages = Math.ceil((historyData?.total || 0) / 10);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl">
      <Card className="mb-4 sm:mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-2xl font-bold">Consulta de CPF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <CpfInput cpf={cpf} onChange={setCpf} />
            <Button
              onClick={handleConsulta}
              disabled={isLoadingCpf}
              className="w-full sm:w-auto whitespace-nowrap"
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
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
              <p className="font-medium text-sm sm:text-base">
                <span className="text-muted-foreground">Nome:</span>{" "}
                <span className="font-semibold">{cpfData.nome}</span>
              </p>
              <p className="font-medium text-sm sm:text-base">
                <span className="text-muted-foreground">Saldo:</span>{" "}
                <span className="font-semibold">{cpfData.saldo}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-2xl font-bold">Histórico de Consultas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por CPF ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="-mx-4 sm:mx-0">
            <SearchHistory
              data={historyData?.items || []}
              isLoading={isLoadingHistory}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CpfConsulta;
