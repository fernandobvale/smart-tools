
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ClipboardCopy, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SupabaseProjectForm } from "./SupabaseProjectForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";

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
  const [showSecret, setShowSecret] = useState<{ [k: string]: boolean }>({});

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

  function mask(str?: string) {
    if (!str) return "";
    return "•".repeat(10) + " (" + (str.length || 0) + " caracteres)";
  }

  const copyToClipboard = (v: string) => {
    navigator.clipboard.writeText(v);
    toast({ title: "Copiado para área de transferência" });
  };

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
          <DialogContent>
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
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map(project => (
                <div key={project.id} className="border rounded-lg p-4 bg-accent/40 flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {project.project_name}
                        <Button title="Editar" onClick={() => handleEdit(project)} size="icon" variant="ghost">
                          <Pencil size={17} />
                        </Button>
                        <Button title="Deletar" onClick={() => handleDelete(project.id)} size="icon" variant="ghost">
                          <Trash2 size={17} />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">{project.supabase_url}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm mt-2">
                    <div>
                      <span className="font-semibold">User Email: </span>{project.user_email}
                    </div>
                    <div>
                      <span className="font-semibold">Anon key: </span>
                      <span
                        onClick={() => setShowSecret((s) => ({ ...s, ["anon_key_"+project.id]: !s["anon_key_"+project.id] }))}
                        className="cursor-pointer select-none"
                      >
                        {showSecret["anon_key_"+project.id] ? project.anon_key : mask(project.anon_key)}
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(project.anon_key)}>
                          <ClipboardCopy size={15}/>
                        </Button>
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Service Role: </span>
                      <span
                        onClick={() => setShowSecret((s) => ({ ...s, ["service_role_key_"+project.id]: !s["service_role_key_"+project.id] }))}
                        className="cursor-pointer select-none"
                      >
                        {showSecret["service_role_key_"+project.id] ? project.service_role_key : mask(project.service_role_key)}
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(project.service_role_key)}>
                          <ClipboardCopy size={15}/>
                        </Button>
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">ID do Projeto: </span>
                      {project.project_id}
                    </div>
                    <div>
                      <span className="font-semibold">Dashboard: </span>
                      <a href={project.dashboard_url} target="_blank" className="hover:underline text-violet-700">{project.dashboard_url}</a>
                    </div>
                    <div>
                      <span className="font-semibold">Banco: </span>
                      <span title={project.db_host}>
                        {project.db_host}:{project.db_port}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Usuário DB: </span>{project.db_user}
                    </div>
                    <div>
                      <span className="font-semibold">Senha DB: </span>
                      <span
                        onClick={() => setShowSecret((s) => ({ ...s, ["db_password_"+project.id]: !s["db_password_"+project.id] }))}
                        className="cursor-pointer select-none"
                      >
                        {showSecret["db_password_"+project.id] ? project.db_password : mask(project.db_password)}
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(project.db_password)}>
                          <ClipboardCopy size={15}/>
                        </Button>
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Nome DB: </span>{project.db_name}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Criado em: {new Date(project.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}
