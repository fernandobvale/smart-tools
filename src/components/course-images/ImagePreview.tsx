import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Imagem Gerada</h3>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{courseName}</CardTitle>
              <CardDescription>
                {image.dimensions} • {formatSize(image.size)}
              </CardDescription>
            </div>
            <Badge variant="secondary">{image.format.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img 
              src={image.image} 
              alt={`Capa do curso ${courseName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar Imagem
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
