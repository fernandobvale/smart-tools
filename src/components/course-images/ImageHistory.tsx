import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseImage } from "./types";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ImageHistory() {
  const { toast } = useToast();

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['course-images-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as CourseImage[];
    },
  });

  const handleDownload = (image: CourseImage) => {
    const link = document.createElement('a');
    link.href = image.image_data;
    link.download = `${image.course_name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('course_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Imagem removida",
        description: "A imagem foi removida do histórico com sucesso.",
      });

      refetch();
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a imagem.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Histórico</h3>
        <p className="text-sm text-muted-foreground">Carregando histórico...</p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Histórico</h3>
        <p className="text-sm text-muted-foreground">Nenhuma imagem gerada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Histórico (últimas 10 gerações)</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={image.image_data} 
                  alt={`Capa do curso ${image.course_name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div>
                <CardTitle className="text-sm line-clamp-1">{image.course_name}</CardTitle>
                <CardDescription className="text-xs">
                  {format(new Date(image.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleDownload(image)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
