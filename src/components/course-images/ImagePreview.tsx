import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedImage } from "./types";
import { Download, RefreshCw } from "lucide-react";

interface ImagePreviewProps {
  image: GeneratedImage;
  courseName: string;
  onDownload: () => void;
  onRegenerate: () => void;
}

export function ImagePreview({ image, courseName, onDownload, onRegenerate }: ImagePreviewProps) {
  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  const isLargeSize = image.size > 100000;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Imagem Gerada</h3>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{courseName}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{image.dimensions}</Badge>
              <Badge variant={isLargeSize ? "destructive" : "secondary"}>
                {formatSize(image.size)}
              </Badge>
              <Badge>{image.format.toUpperCase()}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Container com background escuro e tamanho controlado */}
          <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img 
              src={image.image} 
              alt={`Capa do curso ${courseName}`}
              className="max-w-full max-h-[400px] w-auto h-auto rounded shadow-lg object-contain"
            />
          </div>
          
          {/* Botões lado a lado */}
          <div className="flex gap-2">
            <Button onClick={onDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar {image.format.toUpperCase()}
            </Button>
            <Button onClick={onRegenerate} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
