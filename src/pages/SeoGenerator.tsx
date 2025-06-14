import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SeoGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSeoContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo-content", {
        body: {
          title,
          description,
          keywords,
        },
      });

      if (error) {
        console.error("Error generating content:", error);
        toast.error("Erro ao gerar conteúdo SEO. Tente novamente.");
      } else {
        setGeneratedContent(data);
        toast.success("Conteúdo SEO gerado com sucesso!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Conteúdo copiado para a área de transferência!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Conteúdo SEO</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição:</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="keywords">Palavras-chave (separadas por vírgula):</Label>
          <Input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <Button onClick={generateSeoContent} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Conteúdo SEO"}
        </Button>
        {generatedContent && (
          <div className="mt-4">
            <Label>Conteúdo Gerado:</Label>
            <Textarea
              readOnly
              value={generatedContent}
              className="bg-gray-100"
            />
            <Button onClick={handleCopyToClipboard} className="mt-2">
              Copiar para a Área de Transferência
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoGenerator;
