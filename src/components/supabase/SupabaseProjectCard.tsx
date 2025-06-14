
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ClipboardCopy, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SupabaseProjectCardProps {
  project: {
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
  }
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
}

export function SupabaseProjectCard({ project, onEdit, onDelete }: SupabaseProjectCardProps) {
  const [showSecret, setShowSecret] = useState<{ [k: string]: boolean }>({});

  function mask(str?: string) {
    if (!str) return "";
    return "•".repeat(10) + " (" + (str.length || 0) + " caracteres)";
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copiado para área de transferência" });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-accent/40 shadow-md border-2 border-accent p-0">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <div>
          <CardTitle className="text-2xl">{project.project_name}</CardTitle>
          <CardDescription className="text-xs">{project.supabase_url}</CardDescription>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => onEdit(project)} title="Editar">
            <Pencil size={18} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(project.id)} title="Deletar">
            <Trash2 size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <span className="font-semibold">Email do Usuário: </span>
          <span>{project.user_email}</span>
        </div>
        <div className="mb-2 grid sm:grid-cols-2 gap-3">
          <div>
            <span className="font-semibold">ID do Projeto: </span>
            <span>{project.project_id}</span>
          </div>
          <div>
            <span className="font-semibold">Dashboard: </span>
            <a href={project.dashboard_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-violet-700">{project.dashboard_url}</a>
          </div>
        </div>
        <div className="mb-3">
          <span className="font-semibold">Anon Key: </span>
          <span
            onClick={() => setShowSecret(s => ({ ...s, anon: !s.anon }))}
            className="cursor-pointer select-none inline-flex items-center"
          >
            {showSecret.anon ? project.anon_key : mask(project.anon_key)}
            <Button size="icon" variant="ghost" className="ml-1" onClick={() => copyToClipboard(project.anon_key)}>
              <ClipboardCopy size={15}/>
            </Button>
          </span>
        </div>
        <div className="mb-3">
          <span className="font-semibold">Service Role Key: </span>
          <span
            onClick={() => setShowSecret(s => ({ ...s, service: !s.service }))}
            className="cursor-pointer select-none inline-flex items-center"
          >
            {showSecret.service ? project.service_role_key : mask(project.service_role_key)}
            <Button size="icon" variant="ghost" className="ml-1" onClick={() => copyToClipboard(project.service_role_key)}>
              <ClipboardCopy size={15}/>
            </Button>
          </span>
        </div>
        <div className="mb-2 font-semibold text-lg pt-2">Banco de Dados PostgreSQL</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <span className="font-semibold">Host: </span>
            <span>{project.db_host}:{project.db_port}</span>
          </div>
          <div>
            <span className="font-semibold">Usuário: </span>
            <span>{project.db_user}</span>
          </div>
          <div>
            <span className="font-semibold">Senha: </span>
            <span
              onClick={() => setShowSecret(s => ({ ...s, db: !s.db }))}
              className="cursor-pointer select-none inline-flex items-center"
            >
              {showSecret.db ? project.db_password : mask(project.db_password)}
              <Button size="icon" variant="ghost" className="ml-1" onClick={() => copyToClipboard(project.db_password)}>
                <ClipboardCopy size={15} />
              </Button>
            </span>
          </div>
          <div>
            <span className="font-semibold">Nome DB: </span>
            <span>{project.db_name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground pt-2">
        <span>Criado em: {new Date(project.created_at).toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}
