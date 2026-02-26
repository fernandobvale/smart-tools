import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: teacher, isLoading } = useQuery({
    queryKey: ["teacher-application", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_applications")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground mb-4">Professor não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/teacher-list")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    );
  }

  const fields = [
    { label: "Nome Completo", value: teacher.full_name },
    { label: "Email", value: teacher.email },
    { label: "WhatsApp", value: teacher.whatsapp },
    { label: "Formação Acadêmica", value: teacher.academic_background, pre: true },
    { label: "Experiência como Professor", value: teacher.teaching_experience, pre: true },
    { label: "Experiência com Gravação de Vídeos", value: teacher.video_experience === "sim" ? "Sim" : "Não" },
    { label: "Motivação", value: teacher.motivation, pre: true },
    {
      label: "Data de Inscrição",
      value: new Date(teacher.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      }),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="outline" onClick={() => navigate("/teacher-list")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <h1 className="text-2xl font-bold mb-8">Detalhes do Professor</h1>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.label} className="border-b pb-4 last:border-b-0">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">{field.label}</h4>
            <p className={field.pre ? "whitespace-pre-wrap" : ""}>{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
