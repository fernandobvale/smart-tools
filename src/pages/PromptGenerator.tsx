import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PromptForm } from "@/components/prompt-generator/PromptForm";
import { FormData } from "@/components/prompt-generator/types";
import { Button } from "@/components/ui/button";
import { GeneratedPrompt } from "@/components/prompt-generator/GeneratedPrompt";
import { toast } from "sonner";

export default function PromptGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    courseName: "",
    courseContent: "",
    workload: "",
    courseArea: "",
    areaLink: "",
    course1: "",
    course1Link: "",
    course2: "",
    course2Link: "",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        navigate("/prompt-list");
        return null;
      }
      
      return data;
    },
    enabled: !!id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    const prompt = `Crie um texto para divulgação do curso ${formData.courseName} no formato de um post para o LinkedIn.

O texto deve ter no máximo 3 parágrafos, sendo:
1. Primeiro parágrafo: Chamar atenção para a importância da área ${formData.courseArea} (${formData.areaLink})
2. Segundo parágrafo: Apresentar o curso ${formData.courseName} com carga horária de ${formData.workload}, destacando os principais tópicos do conteúdo programático: ${formData.courseContent}
3. Terceiro parágrafo: Call to action convidando para conhecer outros cursos da área como ${formData.course1} (${formData.course1Link}) e ${formData.course2} (${formData.course2Link})

Importante:
- Mantenha um tom profissional e objetivo
- Use hashtags relevantes
- Inclua emojis de forma moderada
- Mantenha os links como estão, sem encurtar`;

    setGeneratedPrompt(prompt);
    toast.success("Prompt gerado com sucesso!");
  };

  useEffect(() => {
    if (prompt) {
      setFormData({
        courseName: prompt.course_name || "",
        courseContent: prompt.course_content || "",
        workload: prompt.workload || "",
        courseArea: prompt.course_area || "",
        areaLink: prompt.area_link || "",
        course1: prompt.course_1 || "",
        course1Link: prompt.course_1_link || "",
        course2: prompt.course_2 || "",
        course2Link: prompt.course_2_link || "",
      });
    }
  }, [prompt]);

  if (isLoading) {
    return <div className="container py-8">Carregando...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">
        {id ? "Editar Prompt" : "Gerar Novo Prompt"}
      </h1>
      <PromptForm 
        formData={formData}
        onChange={handleChange}
      />
      <div className="mt-6">
        <Button onClick={generatePrompt} className="w-full">
          Gerar Prompt
        </Button>
      </div>
      <GeneratedPrompt prompt={generatedPrompt} />
    </div>
  );
}