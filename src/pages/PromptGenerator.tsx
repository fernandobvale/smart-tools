import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PromptGenerator() {
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const { error } = await supabase.from('prompts').insert({
        course_name: formData.courseName,
        course_content: formData.courseContent,
        workload: formData.workload,
        course_area: formData.courseArea,
        area_link: formData.areaLink,
        course_1: formData.course1,
        course_1_link: formData.course1Link,
        course_2: formData.course2,
        course_2_link: formData.course2Link,
        generated_prompt: prompt
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Prompt gerado e salvo com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nome do Curso</label>
          <Input
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="Digite o nome do curso"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Conteúdo Programático</label>
          <Textarea
            name="courseContent"
            value={formData.courseContent}
            onChange={handleInputChange}
            placeholder="Digite o conteúdo programático"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Carga Horária</label>
          <Input
            name="workload"
            value={formData.workload}
            onChange={handleInputChange}
            placeholder="Digite a carga horária"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Área do Curso</label>
          <Input
            name="courseArea"
            value={formData.courseArea}
            onChange={handleInputChange}
            placeholder="Digite a área do curso"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Link da Área</label>
          <Input
            name="areaLink"
            value={formData.areaLink}
            onChange={handleInputChange}
            placeholder="Digite o link da área"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Curso 1</label>
          <Input
            name="course1"
            value={formData.course1}
            onChange={handleInputChange}
            placeholder="Digite o nome do curso 1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Link Curso 1</label>
          <Input
            name="course1Link"
            value={formData.course1Link}
            onChange={handleInputChange}
            placeholder="Digite o link do curso 1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Curso 2</label>
          <Input
            name="course2"
            value={formData.course2}
            onChange={handleInputChange}
            placeholder="Digite o nome do curso 2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Link Curso 2</label>
          <Input
            name="course2Link"
            value={formData.course2Link}
            onChange={handleInputChange}
            placeholder="Digite o link do curso 2"
          />
        </div>

        <Button 
          onClick={generatePrompt} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Gerando..." : "Gerar Prompt"}
        </Button>

        {generatedPrompt && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Prompt Gerado:</h2>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {generatedPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}