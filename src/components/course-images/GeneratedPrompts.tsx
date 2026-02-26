import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedPrompt } from "./types";
import { Image, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface GeneratedPromptsProps {
  prompts: GeneratedPrompt[];
  onGenerateImage: (prompt: string, promptId: number) => void;
  isGeneratingImage: boolean;
  generatingPromptId: number | null;
}

export function GeneratedPrompts({ 
  prompts, 
  onGenerateImage, 
  isGeneratingImage,
  generatingPromptId 
}: GeneratedPromptsProps) {
  const [expandedPrompts, setExpandedPrompts] = useState<{ [key: number]: boolean }>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPrompt = (promptEn: string, id: number) => {
    navigator.clipboard.writeText(promptEn);
    setCopiedId(id);
    toast.success("Prompt copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (prompts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prompts Gerados</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Prompt {prompt.id}</CardTitle>
                  <CardDescription>Clique para gerar a imagem</CardDescription>
                </div>
                <Badge variant="secondary">16:9</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="pt" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pt">Português</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
                <TabsContent value="pt" className="space-y-2">
                  <p className={`text-sm ${expandedPrompts[prompt.id] ? '' : 'line-clamp-3'}`}>
                    {prompt.prompt_pt}
                  </p>
                  {prompt.prompt_pt.length > 150 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpand(prompt.id)}
                      className="h-auto p-0 text-xs"
                    >
                      {expandedPrompts[prompt.id] ? 'Ver menos' : 'Ver mais'}
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="en" className="space-y-2">
                  <p className={`text-sm ${expandedPrompts[prompt.id] ? '' : 'line-clamp-3'}`}>
                    {prompt.prompt_en}
                  </p>
                  {prompt.prompt_en.length > 150 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpand(prompt.id)}
                      className="h-auto p-0 text-xs"
                    >
                      {expandedPrompts[prompt.id] ? 'Ver menos' : 'Ver mais'}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyPrompt(prompt.prompt_en, prompt.id)}
                  className="shrink-0"
                >
                  {copiedId === prompt.id ? (
                    <><Check className="mr-2 h-4 w-4" /> Copiado</>
                  ) : (
                    <><Copy className="mr-2 h-4 w-4" /> Copiar Prompt</>
                  )}
                </Button>
                <Button
                  onClick={() => onGenerateImage(prompt.prompt_en, prompt.id)}
                  disabled={isGeneratingImage}
                  className="w-full"
                >
                  {isGeneratingImage && generatingPromptId === prompt.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Imagem...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Gerar Imagem
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
