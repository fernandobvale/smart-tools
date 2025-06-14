
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupabaseProjectCard } from "./SupabaseProjectCard";

type SupabaseProject = {
  id: string;
  project_name: string;
  user_email: string;
  supabase_url: string;
  anon_key: string;
  service_role_key: string;
  project_id: string;
  dashboard_url: string;
  db_host: string;
  db_port: number;
  db_user: string;
  db_password: string;
  db_name: string;
  created_at: string;
  updated_at: string;
  user_password?: string;
  user_password_hash?: string;
};

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: SupabaseProject | null;
  onEdit: (project: SupabaseProject) => void;
  onDelete: (id: string) => void;
}

export function ProjectDetailsModal({ open, onOpenChange, project, onEdit, onDelete }: ProjectDetailsModalProps) {
  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0"
        style={{ padding: 0 }}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="sticky top-0 z-10 bg-background pt-6 pb-2 px-6 shadow-sm">
            <DialogTitle>Detalhes do Projeto</DialogTitle>
            <DialogDescription>
              Veja todas as informações e credenciais desse projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-0 pt-1">
            <SupabaseProjectCard
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
          <DialogFooter className="sticky bottom-0 z-10 bg-background px-6 py-2 mt-0 shadow-[0_-2px_8px_-6px_rgba(0,0,0,0.07)]">
            <DialogClose asChild>
              <Button variant="ghost">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
