
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TABLES = [
  "cursos",
  "certificates",
  "notes",
  "cpf_searches",
  "payees",
  "prompts",
];

export function FixLegacyDataButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    if (!user) {
      toast.error("Você precisa estar logado.");
      return;
    }
    setLoading(true);

    let totalUpdates = 0;
    let errors: string[] = [];

    for (const table of TABLES) {
      try {
        const { data, error } = await supabase
          .from(table)
          .update({ user_id: user.id })
          .is("user_id", null);

        if (error) {
          errors.push(`Erro em ${table}: ${error.message}`);
        }
        if (data && data.length > 0) {
          totalUpdates += data.length;
        }
      } catch (err: any) {
        errors.push(`Erro inesperado em ${table}: ${err?.message || ""}`);
      }
    }

    setLoading(false);

    if (errors.length > 0) {
      toast.error(`Problemas ao atualizar: ${errors.join("; ")}`);
    }
    if (totalUpdates > 0) {
      toast.success(`Registros antigos atualizados com sucesso! (${totalUpdates} registros)`);
    } else if (errors.length === 0) {
      toast("Nenhum registro antigo para atualizar :)");
    }
  };

  // Só admins podem ver o botão
  if (!user) return null;
  // Você pode checar papéis, mas aqui fica visível para todos os logados.
  return (
    <div className="my-6 p-2 border rounded">
      <p className="mb-2 text-sm text-muted-foreground">
        Ferramenta para corrigir dados legados:
      </p>
      <Button variant="outline" disabled={loading} onClick={handleFix}>
        {loading ? "Atualizando..." : "Corrigir Dados Legados"}
      </Button>
    </div>
  );
}
