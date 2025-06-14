
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
    <Card className="w-full max-w-3xl mx-auto bg-accent/30 shadow-lg border-2 border-accent p-0 animate-fade-in">
      {/* Header com título, URL e botões */}
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-6 pb-0">
        <div className="space-y-1 w-full min-w-0">
          <CardTitle className="text-2xl truncate">{project.project_name}</CardTitle>
          <CardDescription
            title={project.supabase_url}
            className="text-xs break-all w-full block"
          >
            {project.supabase_url}
          </CardDescription>
        </div>
        <div className="flex gap-2 pt-2 md:pt-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(project)} title="Editar">
            <Pencil size={18} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(project.id)} title="Deletar">
            <Trash2 size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-3">
        {/* Seção básica */}
        <section className="space-y-1">
          <div>
            <span className="font-semibold">Email do Usuário: </span>
            <span className="break-all">{project.user_email}</span>
          </div>
          <div>
            <span className="font-semibold">ID do Projeto: </span>
            <span className="break-all">{project.project_id}</span>
          </div>
          <div>
            <span className="font-semibold">Dashboard: </span>
            <a
              href={project.dashboard_url}
              target="_blank"
              rel="noopener noreferrer"
              title={project.dashboard_url}
              className="hover:underline text-violet-700 break-all"
            >
              {project.dashboard_url}
            </a>
          </div>
        </section>

        {/* Linha visual separadora */}
        <div className="border-t border-muted my-2" />

        {/* Seção API Keys */}
        <section className="space-y-2">
          <div className="text-sm font-semibold text-muted-foreground">Supabase API Keys</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Anon Key:</span>
              <span
                onClick={() => setShowSecret(s => ({ ...s, anon: !s.anon }))}
                className="cursor-pointer select-none inline-flex items-center bg-accent/40 px-2 py-1 rounded"
                title={showSecret.anon ? project.anon_key : undefined}
              >
                <span className={`max-w-[250px] break-all ${showSecret.anon ? "" : "text-muted-foreground"}`}>
                  {showSecret.anon ? project.anon_key : mask(project.anon_key)}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); copyToClipboard(project.anon_key); }}>
                  <ClipboardCopy size={15} />
                </Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); setShowSecret(s => ({ ...s, anon: !s.anon })); }}>
                  {showSecret.anon ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Service Role Key:</span>
              <span
                onClick={() => setShowSecret(s => ({ ...s, service: !s.service }))}
                className="cursor-pointer select-none inline-flex items-center bg-accent/40 px-2 py-1 rounded"
                title={showSecret.service ? project.service_role_key : undefined}
              >
                <span className={`max-w-[250px] break-all ${showSecret.service ? "" : "text-muted-foreground"}`}>
                  {showSecret.service ? project.service_role_key : mask(project.service_role_key)}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); copyToClipboard(project.service_role_key); }}>
                  <ClipboardCopy size={15} />
                </Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); setShowSecret(s => ({ ...s, service: !s.service })); }}>
                  {showSecret.service ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </span>
            </div>
          </div>
        </section>

        {/* Linha separadora */}
        <div className="border-t border-muted my-2" />

        {/* Seção Banco de Dados */}
        <section className="space-y-1">
          <div className="text-lg font-semibold flex items-center gap-2 pb-1">
            🛢️ Banco de Dados PostgreSQL
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex-1 min-w-0">
              <span className="font-semibold">Host: </span>
              <span className="break-all">{project.db_host}:{project.db_port}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold">Usuário: </span>
              <span className="break-all">{project.db_user}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 pt-1">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span className="font-semibold">Senha: </span>
              <span
                onClick={() => setShowSecret(s => ({ ...s, db: !s.db }))}
                className="cursor-pointer select-none inline-flex items-center bg-accent/40 px-2 py-1 rounded"
                title={showSecret.db ? project.db_password : undefined}
              >
                <span className={`max-w-[180px] break-all ${showSecret.db ? "" : "text-muted-foreground"}`}>
                  {showSecret.db ? project.db_password : mask(project.db_password)}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); copyToClipboard(project.db_password); }}>
                  <ClipboardCopy size={15} />
                </Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); setShowSecret(s => ({ ...s, db: !s.db })); }}>
                  {showSecret.db ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold">Nome DB: </span>
              <span className="break-all">{project.db_name}</span>
            </div>
          </div>
        </section>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2 text-xs text-muted-foreground pt-2">
        <span>Criado em: {new Date(project.created_at).toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}
