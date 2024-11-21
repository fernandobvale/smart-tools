import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface NoteCopyButtonProps {
  content: string;
}

export const NoteCopyButton = ({ content }: NoteCopyButtonProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Nota copiada para a área de transferência");
    } catch (error) {
      toast.error("Erro ao copiar a nota");
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy} className="gap-2">
      <Copy className="h-4 w-4" />
      Copiar nota
    </Button>
  );
};