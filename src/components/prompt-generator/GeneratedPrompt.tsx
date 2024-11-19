import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GeneratedPromptProps {
  prompt: string;
}

export function GeneratedPrompt({ prompt }: GeneratedPromptProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copiado!",
        description: "O prompt foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o prompt.",
        variant: "destructive",
      });
    }
  };

  if (!prompt) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Prompt Gerado:</h2>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copiar
        </Button>
      </div>
      <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
        {prompt}
      </div>
    </div>
  );
}