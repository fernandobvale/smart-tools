import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido"),
  academic_background: z.string().min(1, "Formação acadêmica é obrigatória"),
  teaching_experience: z.string().min(1, "Experiência como professor é obrigatória"),
  video_experience: z.string().min(1, "Selecione uma opção"),
  motivation: z.string().min(1, "Motivação é obrigatória"),
  privacy_accepted: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar a política de privacidade",
  }),
});

export default function TeacherApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privacy_accepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Save to Supabase
      const { error: dbError } = await supabase
        .from("teacher_applications")
        .insert([values]);

      if (dbError) throw dbError;

      // Send email notification
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-teacher-application-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            applicantName: values.full_name,
            applicantEmail: values.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      toast.success("Inscrição enviada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Erro ao enviar inscrição. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/unova-logo.png"
            alt="Unova Cursos"
            className="h-16 mb-6"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Formulário de Inscrição para Professor
          </h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Por favor, preencha todas as informações abaixo para se candidatar a professor parceiro da Unova Cursos.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-[#222632] p-6 rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 11) {
                            value = value.replace(
                              /^(\d{2})(\d{5})(\d{4}).*/,
                              "($1) $2-$3"
                            );
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formação Acadêmica, Técnica ou Profissional</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva sua formação..."
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
                name="teaching_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiência de trabalho como professor</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva sua experiência..."
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
                name="video_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiência na gravação de aulas em vídeo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sim">Sim</SelectItem>
                        <SelectItem value="Não">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação para se tornar professor</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conte-nos sua motivação..."
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
                name="privacy_accepted"
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
                        Aceito a{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Política de Privacidade
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}