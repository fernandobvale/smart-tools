import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageGeneratorForm } from "@/components/course-images/ImageGeneratorForm";
import { GeneratedPrompts } from "@/components/course-images/GeneratedPrompts";
import { ImagePreview } from "@/components/course-images/ImagePreview";
import { ImageHistory } from "@/components/course-images/ImageHistory";
import { GeneratedPrompt, GeneratedImage } from "@/components/course-images/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CourseImageGenerator() {
  const { toast } = useToast();
  const [courseName, setCourseName] = useState("");
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatingPromptId, setGeneratingPromptId] = useState<number | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<{ pt: string; en: string } | null>(null);

  const handleGeneratePrompts = async (name: string) => {
    setIsLoadingPrompts(true);
    setCourseName(name);
    setPrompts([]);
    setGeneratedImage(null);
    setCurrentPrompt(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-course-image-prompts', {
        body: { courseName: name }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setPrompts(data.prompts);
      toast({
        title: "Prompts gerados!",
        description: "Escolha um dos prompts para gerar a imagem.",
      });
    } catch (error) {
      console.error('Erro ao gerar prompts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar os prompts. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleGenerateImage = async (prompt: string, promptId: number) => {
    setIsGeneratingImage(true);
    setGeneratingPromptId(promptId);
    setGeneratedImage(null);

    const selectedPrompt = prompts.find(p => p.id === promptId);
    if (selectedPrompt) {
      setCurrentPrompt({ pt: selectedPrompt.prompt_pt, en: selectedPrompt.prompt_en });
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-course-image', {
        body: { prompt, courseName }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setGeneratedImage(data);

      // Salvar no banco de dados
      if (selectedPrompt) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from('course_images').insert({
            user_id: userData.user.id,
            course_name: courseName,
            prompt_pt: selectedPrompt.prompt_pt,
            prompt_en: selectedPrompt.prompt_en,
            image_data: data.image,
            image_size: data.size
          });
        }
      }

      toast({
        title: "Imagem gerada!",
        description: "Sua imagem está pronta para download.",
      });
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
      setGeneratingPromptId(null);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    // Sanitizar nome do curso para usar como nome de arquivo
    const sanitizedName = courseName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
      .replace(/^-|-$/g, '');          // Remove hífens no início/fim

    // Usar formato real da imagem
    const extension = generatedImage.format || 'jpeg';

    const link = document.createElement('a');
    link.href = generatedImage.image;
    link.download = `${sanitizedName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: `Salvando como ${sanitizedName}.${extension}`,
    });
  };

  const handleRegenerate = () => {
    if (!currentPrompt) return;
    const promptId = prompts.find(p => p.prompt_en === currentPrompt.en)?.id || 1;
    handleGenerateImage(currentPrompt.en, promptId);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de Imagens para Capas de Cursos</h1>
        <p className="text-muted-foreground mt-2">
          Crie capas profissionais para seus cursos usando inteligência artificial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Capa</CardTitle>
          <CardDescription>
            Insira o nome do curso para gerar prompts personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGeneratorForm 
            onGenerate={handleGeneratePrompts}
            isLoading={isLoadingPrompts}
          />
        </CardContent>
      </Card>

      {prompts.length > 0 && (
        <>
          <Separator />
          <GeneratedPrompts 
            prompts={prompts}
            onGenerateImage={handleGenerateImage}
            isGeneratingImage={isGeneratingImage}
            generatingPromptId={generatingPromptId}
          />
        </>
      )}

      {generatedImage && (
        <>
          <Separator />
          <ImagePreview 
            image={generatedImage}
            courseName={courseName}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
          />
        </>
      )}

      <Separator />
      <ImageHistory />
    </div>
  );
}
