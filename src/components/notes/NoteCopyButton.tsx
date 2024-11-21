import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface NoteCopyButtonProps {
  content: string;
}

export const NoteCopyButton = ({ content }: NoteCopyButtonProps) => {
  const handleCopy = async () => {
    try {
      // Create a temporary div to hold the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Select all content in the div
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      
      const selection = window.getSelection();
      if (selection) {
        // Clear any existing selections
        selection.removeAllRanges();
        // Add our new range
        selection.addRange(range);
      }
      
      // Get the text content without HTML tags
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      
      // Copy the text content
      await navigator.clipboard.writeText(textContent);
      
      // Clear the selection
      selection?.removeAllRanges();
      
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