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
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z
    .string()
    .min(11, "WhatsApp inválido")
    .max(11, "WhatsApp inválido")
    .regex(/^\d+$/, "Apenas números são permitidos"),
  academic_background: z.string().min(10, "Por favor, forneça mais detalhes sobre sua formação"),
  teaching_experience: z.string().min(10, "Por favor, forneça mais detalhes sobre sua experiência"),
  video_experience: z.string().min(1, "Selecione uma opção"),
  motivation: z.string().min(10, "Por favor, forneça mais detalhes sobre sua motivação"),
  privacy_accepted: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar a política de privacidade",
  }),
});

export default function TeacherApplication() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      whatsapp: "",
      academic_background: "",
      teaching_experience: "",
      video_experience: "",
      motivation: "",
      privacy_accepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Save to Supabase
      const { error } = await supabase.from("teacher_applications").insert([values]);

      if (error) throw error;

      // Send email notification via Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-teacher-application-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: values.full_name,
            email: values.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      toast({
        title: "Inscrição enviada com sucesso!",
        description: "Agradecemos seu interesse. Você receberá um email de confirmação em breve.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Erro ao enviar inscrição",
        description: "Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
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

        <div className="max-w-2xl mx-auto bg-[#2A2F3C] p-6 rounded-lg shadow-lg">
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
                        placeholder="DDD + Número"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
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
                    <FormLabel>Experiência como Professor</FormLabel>
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
                    <FormLabel>Experiência na Gravação de Aulas em Vídeo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
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
                    <FormLabel>Motivação para se Tornar Professor</FormLabel>
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
                          className="text-blue-400 hover:underline"
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
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                disabled={!form.formState.isValid}
              >
                Enviar Inscrição
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}