import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditorSelectProps {
  form: UseFormReturn<any>;
  editors: { id: string; nome: string; }[];
  onEditorAdded: () => void;
}

export function EditorSelect({ form, editors, onEditorAdded }: EditorSelectProps) {
  const [isNewEditorDialogOpen, setIsNewEditorDialogOpen] = useState(false);
  const [newEditorName, setNewEditorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewEditor = async () => {
    if (!newEditorName.trim()) {
      toast.error("Nome do editor é obrigatório");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("editores")
        .insert([{ nome: newEditorName.trim() }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("Este editor já está cadastrado");
          return;
        }
        throw error;
      }

      toast.success("Editor adicionado com sucesso!");
      setNewEditorName("");
      setIsNewEditorDialogOpen(false);
      onEditorAdded();
      
      // Seleciona automaticamente o novo editor
      if (data) {
        form.setValue("nome_editor", data.nome);
      }
    } catch (error) {
      console.error("Error adding editor:", error);
      toast.error("Erro ao adicionar editor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="nome_editor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Editor</FormLabel>
          <div className="flex gap-2">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione o editor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {editors.map((editor) => (
                  <SelectItem key={editor.id} value={editor.nome}>
                    {editor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isNewEditorDialogOpen} onOpenChange={setIsNewEditorDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Novo Editor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Editor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome do editor"
                    value={newEditorName}
                    onChange={(e) => setNewEditorName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={addNewEditor}
                      disabled={isSubmitting}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}