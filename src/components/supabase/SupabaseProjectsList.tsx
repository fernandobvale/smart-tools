import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SupabaseProjectForm } from "./SupabaseProjectForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
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
};

export function SupabaseProjectsList() {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SupabaseProject | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("supabase_projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Erro ao listar projetos", description: error.message, variant: "destructive" });
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    const { error } = await supabase.from("supabase_projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Projeto deletado com sucesso" });
      fetchProjects();
    }
  }

  function handleEdit(project: SupabaseProject) {
    setSelectedProject(project);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg">Meus projetos Supabase</h2>
        <Dialog open={showForm} onOpenChange={v => { setShowForm(v); if (!v) setSelectedProject(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle>{selectedProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
              <DialogDescription>
                {selectedProject ? "Altere os dados desejados." : "Preencha os campos com os dados do projeto Supabase."}
              </DialogDescription>
            </DialogHeader>
            <SupabaseProjectForm defaultValues={selectedProject || undefined} onSubmitDone={() => { setShowForm(false); fetchProjects(); }} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading
        ? <div className="text-muted-foreground">Carregando...</div>
        : projects.length === 0
          ? <div className="text-muted-foreground text-center p-8">Nenhum projeto cadastrado.</div>
          : (
            <div className="flex flex-col gap-8 items-center">
              {projects.map(project => (
                <SupabaseProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
      }
    </div>
  );
}
