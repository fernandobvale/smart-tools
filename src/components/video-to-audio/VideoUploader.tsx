import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  isConverting: boolean;
  isSupabaseReady: boolean;
  onFileChange: (file: File | null) => void;
}

export function VideoUploader({ isConverting, isSupabaseReady, onFileChange }: VideoUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.includes('video/mp4')) {
      toast({
        title: "Erro no arquivo",
        description: "Por favor, selecione apenas arquivos MP4.",
        variant: "destructive",
      });
      return;
    }
    
    onFileChange(file);
  };

  return (
    <Input
      type="file"
      accept="video/mp4"
      onChange={handleFileChange}
      disabled={isConverting || !isSupabaseReady}
    />
  );
}