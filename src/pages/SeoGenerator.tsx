import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function SeoGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    description: string;
    url: string;
  } | null>(null);
  const { toast } = useToast();

  const isTitleValid = title.length <= 60;
  const isDescriptionValid = description.length >= 130 && description.length <= 150;

  const handleGenerateDescription = async () => {
    if (!title) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo', {
        body: { title }
      });

      if (error) throw error;

      setGeneratedResult({
        title: title,
        description: data.generatedText,
        url: `https://example.com/${title.toLowerCase().replace(/\s+/g, "-")}`,
      });
      setDescription(data.generatedText);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar descrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast({
        title: "Copiado!",
        description: "Descrição copiada para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a descrição",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-3xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Gerador de Descrições SEO</h1>
        <p className="text-muted-foreground">
          Gere descrições otimizadas para SEO utilizando IA
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Título
            <span
              className={`ml-2 ${
                !isTitleValid ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              ({title.length}/60)
            </span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do seu conteúdo"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Descrição
            <span
              className={`ml-2 ${
                !isDescriptionValid ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              ({description.length}/150)
            </span>
          </label>
          <div className="flex gap-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A descrição será gerada automaticamente"
              maxLength={150}
              className="h-24"
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyDescription}
              disabled={!description}
              title="Copiar descrição"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleGenerateDescription}
          disabled={isLoading || !isTitleValid}
          className="w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Gerando..." : "Gerar Descrição"}
        </Button>
      </div>

      {generatedResult && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold">Prévia do Resultado</h2>
          <Alert>
            <AlertDescription>
              <div className="space-y-1">
                <div className="text-blue-600 hover:underline cursor-pointer font-medium">
                  {generatedResult.title}
                </div>
                <div className="text-green-700 text-sm">
                  {generatedResult.url}
                </div>
                <div className="text-sm text-gray-600">
                  {generatedResult.description}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}