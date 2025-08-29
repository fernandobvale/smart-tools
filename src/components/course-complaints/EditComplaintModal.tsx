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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseComplaint } from "./types";

const formSchema = z.object({
  complaint_date: z.string().min(1, "Data da reclamação é obrigatória"),
  course: z.string().min(1, "Curso é obrigatório"),
  school: z.string().min(1, "Escola é obrigatória"),
  complaint: z.string().min(1, "Reclamação é obrigatória"),
  analyst: z.string().optional(),
  action_taken: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
  feedback: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: CourseComplaint | null;
  onUpdated: () => void;
}

export const EditComplaintModal = ({
  open,
  onOpenChange,
  complaint,
  onUpdated,
}: EditComplaintModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaint_date: "",
      course: "",
      school: "",
      complaint: "",
      analyst: "",
      action_taken: "",
      status: "Aberta",
      feedback: "",
    },
  });

  // Reset form when complaint changes
  React.useEffect(() => {
    if (complaint) {
      form.reset({
        complaint_date: complaint.complaint_date,
        course: complaint.course,
        school: complaint.school,
        complaint: complaint.complaint,
        analyst: complaint.analyst || "",
        action_taken: complaint.action_taken || "",
        status: complaint.status,
        feedback: complaint.feedback || "",
      });
    }
  }, [complaint, form]);

  const onSubmit = async (data: FormData) => {
    if (!complaint) return;

    try {
      const { error } = await supabase
        .from("course_complaints")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", complaint.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Reclamação atualizada com sucesso!",
      });

      onOpenChange(false);
      onUpdated();
      form.reset();
    } catch (error) {
      console.error("Erro ao atualizar reclamação:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a reclamação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reclamação</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="complaint_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Reclamação</FormLabel>
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
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
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
              name="complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reclamação</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aberta">Aberta</SelectItem>
                        <SelectItem value="Em análise">Em análise</SelectItem>
                        <SelectItem value="Resolvida">Resolvida</SelectItem>
                        <SelectItem value="Fechada">Fechada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analyst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do responsável" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="action_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Tomada</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[80px]" placeholder="Descreva a ação tomada..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback/Observação</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[80px]" placeholder="Digite seu feedback ou observação..." />
                  </FormControl>
                  <FormMessage />
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