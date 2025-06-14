import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useNoteMutations = (onDeleteSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Nota salva');
    },
    onError: () => {
      toast.error('Erro ao salvar nota');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onDeleteSuccess?.();
      toast.success('Nota excluída');
    },
    onError: () => {
      toast.error('Erro ao excluir nota');
    },
  });

  return {
    updateNoteMutation,
    deleteNoteMutation,
  };
};