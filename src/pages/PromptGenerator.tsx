import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PromptForm } from "@/components/prompt-generator/PromptForm";
import { GeneratedPrompt } from "@/components/prompt-generator/GeneratedPrompt";
import type { FormData } from "@/components/prompt-generator/types";

export default function PromptGenerator() {
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePrompt = async () => {
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

Faça 01 parágrafo sobre o tema: Outros cursos na área de ${formData.courseArea} (Obs: Linkar o nome da área no link a seguir: ${formData.areaLink}) que pode ser do seu interesse. - Utilize as seguintes palavras-chaves: Curso de ${formData.course1} (Obs: Linkar o nome do curso no link a seguir: ${formData.course1Link}), Curso de ${formData.course2} (Obs: Linkar o nome do curso no link a seguir: ${formData.course2Link}).`;

    setGeneratedPrompt(prompt);

    try {
      setIsLoading(true);
      const { error } = await supabase.from("prompts").insert({
        course_name: formData.courseName,
        course_content: formData.courseContent,
        workload: formData.workload,
        course_area: formData.courseArea,
        area_link: formData.areaLink,
        course_1: formData.course1,
        course_1_link: formData.course1Link,
        course_2: formData.course2,
        course_2_link: formData.course2Link,
        generated_prompt: prompt,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Prompt gerado e salvo com sucesso.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar o prompt. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Gerador de Prompts</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para gerar um prompt personalizado
        </p>
      </div>

      <PromptForm formData={formData} onChange={handleInputChange} />

      <Button
        onClick={generatePrompt}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Gerando..." : "Gerar Prompt"}
      </Button>

      <GeneratedPrompt prompt={generatedPrompt} />
    </div>
  );
}