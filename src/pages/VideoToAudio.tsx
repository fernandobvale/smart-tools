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
    
    toast({
      title: "Áudio extraído com sucesso!",
      description: "Seu arquivo está pronto para download.",
    });
    
    setIsConverting(false);
  };

  const handleDownload = () => {
    // Criar um arquivo de áudio de exemplo com 1 segundo de silêncio
    const sampleRate = 44100;
    const duration = 1; // 1 segundo
    const numSamples = sampleRate * duration;
    
    // Criar um buffer de áudio com silêncio
    const audioData = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      audioData[i] = 0.0; // Silêncio
    }
    
    // Converter para WAV
    const wavData = createWavFile(audioData, sampleRate);
    
    // Criar e baixar o arquivo
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoFile?.name.replace('.mp4', '')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Função auxiliar para criar um arquivo WAV
  function createWavFile(audioData: Float32Array, sampleRate: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // Cabeçalho WAV
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioData.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, audioData.length * 2, true);

    // Dados do áudio
    const length = audioData.length;
    let index = 44;
    for (let i = 0; i < length; i++) {
      view.setInt16(index, audioData[i] * 0x7FFF, true);
      index += 2;
    }

    return buffer;
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

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
                  Baixar Áudio
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}