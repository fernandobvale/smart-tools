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
    const prompt = `Informe que trata-se de um curso com conteúdo apenas teórico e não pratico. A partir de agora você irá se tornar meu redator de artigos especialista em SEO. Crie o artigo em Markdown, utilize as TAGS H2 nos títulos e destaque algumas palavras-chave que achar que seja interessante em negrito. Irei passar algumas informações para que possa escrever um artigo conforme minhas orientações. Para ficar por dentro do assunto que quero que escreva, o tema do artigo será sobre:

Curso de ${formData.courseName} Gratuito e Online da Unova.

E o Conteúdo Programático do curso é:

${formData.courseContent}

Pronto, essas são as informações necessárias. Agora, preciso apenas que me informe se entendeu o que tem que fazer, pois passarei as informações a seguir.

Faça 02 parágrafos sobre o tema: Por que fazer o Curso de ${formData.courseName}? - Utilize as seguintes palavras-chaves: Curso Online, Curso Gratuito, Unova Cursos.

Faça 02 parágrafos sobre o tema: O que é ou são ${formData.courseName}?

Faça 02 parágrafos sobre o tema: Qual o objeto do curso?

Faça 01 lista sobre o conteúdo programático e depois faça um resumo do que será ensinado no curso.

Faça 02 parágrafos sobre o tema: Qual é a carga horária do curso? - Utilize as seguintes palavras-chaves: Carga Horária de ${formData.workload} horas, aulas em vídeo, apostila (no singular) em PDF.

Faça 02 parágrafos sobre o tema: Qual a área de trabalho para que faz o curso? Deixe claro que trata-se de um curso livre e não de um curso profissionalizante.

Faça 02 parágrafos sobre o tema: Por que devo me matricular no curso? Utilize as seguintes palavras-chaves: Curso Online, Curso Gratuito, Unova Cursos, Adquirir o Certificado.

Faça 01 parágrafo sobre o tema: Outros cursos na área de ${formData.courseArea}(Obs: Linkar o nome da área no link a seguir: ${formData.areaLink}) que pode ser do seu interesse. - Utilize as seguintes palavras-chaves: Curso de ${formData.course1} (Obs: Linkar o nome do curso no link a seguir: ${formData.course1Link}), Curso de ${formData.course2} (Obs: Linkar o nome do curso no link a seguir: ${formData.course2Link}).`;

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