
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
import { CourseSuggestionFormData } from "./types";
import { useAuth } from "@/components/auth/AuthProvider";

const formSchema = z.object({
  suggestion_date: z.string().min(1, "Data da sugestão é obrigatória"),
  suggested_course: z.string().min(1, "Curso sugerido é obrigatório"),
  school: z.string().min(1, "Escola é obrigatória"),
  attendant: z.string().min(1, "Atendente responsável é obrigatório"),
  observations: z.string().optional(),
  internet_searches: z.string().min(1, "Buscas na internet são obrigatórias"),
  course_created: z.boolean(),
});

interface SuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuggestionSubmitted: () => void;
}

export const SuggestionModal = ({
  open,
  onOpenChange,
  onSuggestionSubmitted,
}: SuggestionModalProps) => {
  const { user } = useAuth();
  const form = useForm<CourseSuggestionFormData>({
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

  const onSubmit = async (data: CourseSuggestionFormData) => {
    try {
      console.log('Enviando sugestão...', { user: !!user, data });

      // Preparar dados para inserção
      const insertData = {
        ...data,
        user_id: user ? user.id : null // Se não está logado, user_id será null
      };

      console.log('Dados para inserir:', insertData);

      const { error } = await supabase
        .from("course_suggestions")
        .insert(insertData);

      if (error) {
        console.error('Erro ao inserir sugestão:', error);
        throw error;
      }

      console.log('Sugestão registrada com sucesso!');

      toast({
        title: "Sucesso",
        description: user 
          ? "Sugestão de curso registrada com sucesso!"
          : "Sugestão de curso registrada com sucesso! Obrigado pela sua contribuição.",
      });

      onOpenChange(false);
      onSuggestionSubmitted();
      form.reset();
    } catch (error) {
      console.error("Erro ao registrar sugestão:", error);
      toast({
        title: "Erro",
        description: "Erro ao registrar a sugestão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Sugestão de Curso</DialogTitle>
          {!user && (
            <p className="text-sm text-muted-foreground">
              Você está sugerindo um curso como visitante. Sua sugestão será registrada anonimamente.
            </p>
          )}
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
                      <Input {...field} placeholder="Nome do curso sugerido" />
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
                      <Input {...field} placeholder="Nome da escola" />
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
                    <Input {...field} placeholder="Nome do atendente" />
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
                    <Textarea {...field} className="min-h-[80px]" placeholder="Descreva as buscas realizadas na internet..." />
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
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[80px]" placeholder="Observações adicionais..." />
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
                Registrar Sugestão
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
