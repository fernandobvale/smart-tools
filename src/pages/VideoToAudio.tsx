import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VideoToAudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
    
    setVideoFile(file);
  };

  const handleClear = () => {
    setVideoFile(null);
    setProgress(0);
  };

  const handleExtract = async () => {
    if (!videoFile) return;
    
    setIsConverting(true);
    setProgress(0);
    
    // Simulando o processo de conversão
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }
    
    // Aqui você implementaria a lógica real de conversão
    // Por enquanto, vamos apenas simular um download
    
    toast({
      title: "Áudio extraído com sucesso!",
      description: "Seu arquivo está pronto para download.",
    });
    
    setIsConverting(false);
  };

  const handleDownload = () => {
    // Simulando download - em uma implementação real,
    // isso viria do backend após a conversão
    const blob = new Blob([''], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoFile?.name.replace('.mp4', '')}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversor de Vídeo para Áudio</CardTitle>
          <CardDescription>
            Extraia o áudio de seus vídeos MP4 e salve como MP3
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              disabled={isConverting}
            />
            {videoFile && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {videoFile.name}
              </p>
            )}
          </div>

          {videoFile && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleExtract}
                  disabled={isConverting}
                >
                  Extrair Áudio
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isConverting}
                >
                  Limpar
                </Button>
              </div>

              {isConverting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">
                    Convertendo... {progress}%
                  </p>
                </div>
              )}

              {progress === 100 && !isConverting && (
                <Button onClick={handleDownload}>
                  Baixar MP3
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}