import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tool {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  href: string;
  external: boolean;
  category: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface NewTool {
  name: string;
  description?: string;
  icon: string;
  href: string;
  external?: boolean;
  category: string;
}

export function useTools() {
  const queryClient = useQueryClient();

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Tool[];
    },
  });

  const createTool = useMutation({
    mutationFn: async (newTool: NewTool) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("tools")
        .insert({
          ...newTool,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Ferramenta adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar ferramenta: " + error.message);
    },
  });

  const updateTool = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NewTool> }) => {
      const { data, error } = await supabase
        .from("tools")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Ferramenta atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar ferramenta: " + error.message);
    },
  });

  const deleteTool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Ferramenta removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover ferramenta: " + error.message);
    },
  });

  return {
    tools,
    isLoading,
    createTool: createTool.mutate,
    updateTool: updateTool.mutate,
    deleteTool: deleteTool.mutate,
  };
}
