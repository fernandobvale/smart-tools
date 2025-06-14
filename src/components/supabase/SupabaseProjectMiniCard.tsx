
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SupabaseProject = {
  id: string;
  project_name: string;
  // Outros campos omitidos — só vamos usar nome/id aqui
};

interface SupabaseProjectMiniCardProps {
  project: SupabaseProject;
  onClick: () => void;
  onEdit: (project: SupabaseProject) => void;
  onDelete: (id: string) => void;
}

export function SupabaseProjectMiniCard({ project, onClick, onEdit, onDelete }: SupabaseProjectMiniCardProps) {
  return (
    <Card className="w-full min-w-[220px] max-w-xs cursor-pointer hover:shadow-lg border-2 border-accent/50 transition" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg truncate w-[140px]">{project.project_name}</CardTitle>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" title="Editar" onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="ghost" title="Deletar" onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-xs text-muted-foreground">
        Clique para ver detalhes
      </CardContent>
    </Card>
  );
}
