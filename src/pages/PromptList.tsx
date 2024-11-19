import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/certificates/SearchInput";
import { Plus, Copy, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Prompt {
  id: string;
  course_name: string;
  generated_prompt: string;
}

export default function PromptList() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: prompts, refetch } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, course_name, generated_prompt");
      
      if (error) throw error;
      return data as Prompt[];
    },
  });

  const filteredPrompts = prompts?.filter((prompt) =>
    prompt.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copiado!",
        description: "O prompt foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o prompt.",
        variant: "destructive",
      });
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Prompt excluído com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o prompt.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Prompts</h1>
        <Button onClick={() => navigate("/prompt-generator")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Prompt
        </Button>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome do curso..."
      />

      <div className="space-y-4">
        {filteredPrompts?.map((prompt) => (
          <div
            key={prompt.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <span className="font-medium">{prompt.course_name}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyPrompt(prompt.generated_prompt)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/prompt-generator/${prompt.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deletePrompt(prompt.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}