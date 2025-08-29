
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseSuggestion } from "./types";

const formSchema = z.object({
  suggestion_date: z.string().min(1, "Data da sugestão é obrigatória"),
  suggested_course: z.string().min(1, "Curso sugerido é obrigatório"),
  school: z.string().min(1, "Escola é obrigatória"),
  attendant: z.string().min(1, "Atendente responsável é obrigatório"),
  observations: z.string().optional(),
  internet_searches: z.string().min(1, "Buscas na internet são obrigatórias"),
  course_created: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface EditSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: CourseSuggestion | null;
  onUpdated: () => void;
}

export const EditSuggestionModal = ({
  open,
  onOpenChange,
  suggestion,
  onUpdated,
}: EditSuggestionModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      suggestion_date: "",
      suggested_course: "",
      school: "",
      attendant: "",
      observations: "",
      internet_searches: "",
      course_created: false,
    },
  });

  // Reset form when suggestion changes
  React.useEffect(() => {
    if (suggestion) {
      form.reset({
        suggestion_date: suggestion.suggestion_date,
        suggested_course: suggestion.suggested_course,
        school: suggestion.school,
        attendant: suggestion.attendant,
        observations: suggestion.observations || "",
        internet_searches: suggestion.internet_searches,
        course_created: suggestion.course_created,
      });
    }
  }, [suggestion, form]);

  const onSubmit = async (data: FormData) => {
    if (!suggestion) return;

    try {
      const { error } = await (supabase as any)
        .from("course_suggestions")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", suggestion.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sugestão atualizada com sucesso!",
      });

      onOpenChange(false);
      onUpdated();
      form.reset();
    } catch (error) {
      console.error("Erro ao atualizar sugestão:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a sugestão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Sugestão de Curso</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="suggestion_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Sugestão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="suggested_course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso Sugerido</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="attendant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atendente Responsável</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internet_searches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buscas na Internet</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course_created"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Curso Criado?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
