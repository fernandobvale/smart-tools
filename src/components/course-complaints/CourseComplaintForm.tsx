
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CourseComplaintFormData } from "./types";

const formSchema = z.object({
  complaint_date: z.string().min(1, "Data da reclamação é obrigatória"),
  course: z.string().min(1, "Curso é obrigatório"),
  school: z.string().min(1, "Escola é obrigatória"),
  complaint: z.string().min(10, "Reclamação deve ter pelo menos 10 caracteres"),
  analyst: z.string().optional(),
  action_taken: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
});

interface CourseComplaintFormProps {
  onComplaintSubmitted: () => void;
}

export const CourseComplaintForm = ({ onComplaintSubmitted }: CourseComplaintFormProps) => {
  const form = useForm<CourseComplaintFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaint_date: new Date().toISOString().split('T')[0],
      course: "",
      school: "",
      complaint: "",
      analyst: "",
      action_taken: "",
      status: "Aberta",
    },
  });

  const onSubmit = async (values: CourseComplaintFormData) => {
    try {
      const { error } = await supabase
        .from('course_complaints')
        .insert([values]);

      if (error) {
        console.error('Erro ao salvar reclamação:', error);
        toast.error("Erro ao salvar reclamação. Tente novamente.");
        return;
      }

      toast.success("Reclamação enviada com sucesso!");
      form.reset({
        complaint_date: new Date().toISOString().split('T')[0],
        course: "",
        school: "",
        complaint: "",
        analyst: "",
        action_taken: "",
        status: "Aberta",
      });
      onComplaintSubmitted();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Reclamação de Curso</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para registrar uma reclamação sobre um curso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aberta">Aberta</SelectItem>
                        <SelectItem value="Em Análise">Em Análise</SelectItem>
                        <SelectItem value="Resolvida">Resolvida</SelectItem>
                        <SelectItem value="Não Procede">Não Procede</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do curso" {...field} />
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
                      <Input placeholder="Nome da escola" {...field} />
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
                    <Textarea 
                      placeholder="Descreva sua reclamação..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="analyst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável pela Análise (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Tomada (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva as ações tomadas..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Enviar Reclamação
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
