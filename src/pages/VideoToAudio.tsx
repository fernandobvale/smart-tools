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
import { supabase } from "@/lib/supabase";

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
    
    try {
      setIsConverting(true);
      setProgress(10);

      // Primeiro, verificar se temos acesso ao Storage
      const { data: bucketExists, error: bucketError } = await supabase
        .storage
        .getBucket('media');

      if (bucketError) {
        throw new Error(`Erro ao acessar o Storage: ${bucketError.message}. Por favor, verifique se o bucket 'media' existe e se você tem as permissões necessárias.`);
      }

      if (!bucketExists) {
        throw new Error("O bucket 'media' não existe no Supabase Storage. Por favor, crie-o primeiro.");
      }

      setProgress(20);

      // Upload do vídeo
      const videoFileName = `videos/${Date.now()}-${videoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(videoFileName, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error(`Erro no upload do vídeo: ${uploadError.message}`);
      }

      setProgress(50);

      // Chamar Edge Function
      const { data: conversionData, error: conversionError } = await supabase.functions
        .invoke('convert-video-to-audio', {
          body: { videoPath: videoFileName }
        });

      if (conversionError) {
        console.error('Erro na conversão:', conversionError);
        throw new Error(`Erro na conversão do vídeo: ${conversionError.message}`);
      }

      if (!conversionData?.audioPath) {
        throw new Error('A função de conversão não retornou o caminho do áudio');
      }

      setProgress(80);

      // Obter URL do áudio
      const { data: audioData, error: audioError } = await supabase.storage
        .from('media')
        .createSignedUrl(conversionData.audioPath, 3600);

      if (audioError) {
        console.error('Erro ao obter URL do áudio:', audioError);
        throw new Error(`Erro ao gerar URL do áudio: ${audioError.message}`);
      }

      if (!audioData?.signedUrl) {
        throw new Error('URL do áudio não foi gerada');
      }
      
      setProgress(100);
      toast({
        title: "Áudio extraído com sucesso!",
        description: "Seu arquivo está pronto para download.",
      });

      // Iniciar download
      window.location.href = audioData.signedUrl;

    } catch (error) {
      console.error('Erro detalhado:', error);
      toast({
        title: "Erro na conversão",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao converter o vídeo para áudio.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversor de Vídeo para Áudio</CardTitle>
          <CardDescription>
            Extraia o áudio de seus vídeos MP4 e salve como arquivo de áudio
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
                  {isConverting ? "Convertendo..." : "Extrair Áudio"}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}