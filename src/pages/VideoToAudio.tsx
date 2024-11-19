import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { VideoUploader } from "@/components/video-to-audio/VideoUploader";
import { ConversionProgress } from "@/components/video-to-audio/ConversionProgress";

export default function VideoToAudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // Verificar se o bucket existe
        const { data: bucketData, error: bucketError } = await supabase
          .storage
          .getBucket('media');

        if (bucketError) {
          console.error('Erro ao verificar bucket:', bucketError);
          return;
        }

        setIsSupabaseReady(true);
      } catch (error) {
        console.error('Erro ao verificar configuração:', error);
        setIsSupabaseReady(false);
      }
    };

    checkSetup();
  }, []);

  const handleClear = () => {
    setVideoFile(null);
    setProgress(0);
  };

  const handleExtract = async () => {
    if (!videoFile || !isSupabaseReady) {
      toast({
        title: "Não é possível processar",
        description: isSupabaseReady 
          ? "Selecione um arquivo de vídeo." 
          : "Sistema não está pronto. Verifique sua conexão.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConverting(true);
      setProgress(10);

      // Upload do vídeo para o bucket 'media'
      const videoFileName = `videos/${Date.now()}-${videoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(videoFileName, videoFile);

      if (uploadError) {
        throw new Error(`Erro no upload do vídeo: ${uploadError.message}`);
      }

      setProgress(50);

      // Chamar a função de conversão
      const { data: conversionData, error: conversionError } = await supabase.functions
        .invoke('convert-video-to-audio', {
          body: { videoPath: videoFileName }
        });

      if (conversionError) {
        throw new Error(`Erro na conversão: ${conversionError.message}`);
      }

      setProgress(80);

      // Gerar URL para download
      const { data: audioData, error: audioError } = await supabase.storage
        .from('media')
        .createSignedUrl(`audio/${conversionData.audioPath}`, 3600);

      if (audioError) {
        throw new Error(`Erro ao gerar URL do áudio: ${audioError.message}`);
      }

      setProgress(100);
      toast({
        title: "Áudio extraído com sucesso!",
        description: "Seu arquivo está pronto para download.",
      });

      // Iniciar o download
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
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Conversor de Vídeo para Áudio</CardTitle>
          <CardDescription>
            Extraia o áudio de seus vídeos MP4 e salve como arquivo de áudio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <VideoUploader
              isConverting={isConverting}
              isSupabaseReady={isSupabaseReady}
              onFileChange={setVideoFile}
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
                  disabled={isConverting || !isSupabaseReady}
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

              {isConverting && <ConversionProgress progress={progress} />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}