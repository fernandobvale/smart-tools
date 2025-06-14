
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
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Detalhes do Projeto</DialogTitle>
          <DialogDescription>
            Veja todas as informações e credenciais desse projeto.
          </DialogDescription>
        </DialogHeader>
        <SupabaseProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
