
// WARNING: Always import React as "import * as React from 'react'".
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupabaseProjectCard } from "./SupabaseProjectCard";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // O header tem cerca de 80px, o footer ~60px, reservamos altura para ambos no ScrollArea
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] p-0"
        style={{ padding: 0 }}
      >
        <div className="flex flex-col" style={{ maxHeight: "90vh" }}>
          <DialogHeader className="bg-background pt-6 pb-2 px-6 shadow-sm">
            <DialogTitle>Detalhes do Projeto</DialogTitle>
            <DialogDescription>
              Veja todas as informações e credenciais desse projeto.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea
            className="px-2 pb-0 pt-1"
            style={{ maxHeight: "calc(90vh - 140px)" }} // 140px: header + footer
          >
            <SupabaseProjectCard
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </ScrollArea>
          <DialogFooter className="bg-background px-6 py-2 mt-0 shadow-[0_-2px_8px_-6px_rgba(0,0,0,0.07)]">
            <DialogClose asChild>
              <Button variant="ghost">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
