
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
            className="text-xs break-all w-full block flex items-center"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span className="break-all">{project.supabase_url}</span>
            <Button
              size="icon"
              variant="ghost"
              className="ml-1"
              title="Copiar URL"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(project.supabase_url);
              }}
            >
              {/* Lucide "copy" */}
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </svg>
            </Button>
          </CardDescription>
        </div>
        <div className="flex gap-2 pt-2 md:pt-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(project)} title="Editar">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
              <path d="m18 2 4 4-14.5 14.5c-.4.4-.8.7-1.3.8l-4 1c-.3.1-.6-.2-.5-.5l1-4c.1-.5.4-.9.8-1.3Z" />
              <path d="M15 6 18 9" />
            </svg>
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(project.id)} title="Deletar">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
              <path d="M3 6h18" />
              <path d="M8 6v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6" />
            </svg>
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
          {/* Nova linha: senha do usuário, se houver */}
          {project.user_password_hash && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Senha do Usuário: </span>
              <span
                onClick={() => setShowSecret(s => ({ ...s, login: !s.login }))}
                className="cursor-pointer select-none inline-flex items-center bg-accent/40 px-2 py-1 rounded"
                title={showSecret.login ? project.user_password_hash : undefined}
              >
                <span className={`max-w-[180px] break-all ${showSecret.login ? "" : "text-muted-foreground"}`}>
                  {showSecret.login ? project.user_password_hash : mask(project.user_password_hash)}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={e => { e.stopPropagation(); copyToClipboard(project.user_password_hash); }}>
                  {/* Lucide "copy" */}
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                </Button>
                <Button size="icon" variant="ghost" className="ml-1"
                  onClick={e => { e.stopPropagation(); setShowSecret(s => ({ ...s, login: !s.login })); }}>
                  {/* Lucide toggle eye/eye-off */}
                  {showSecret.login ? (
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                      <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-10-8-10-8a17.46 17.46 0 0 1 4.22-5.53" />
                      <path d="M1 1l22 22" />
                      <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c.46 0 .9-.08 1.31-.22" />
                      <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-10-8-10-8a17.46 17.46 0 0 1 4.22-5.53" />
                    </svg>
                  ) : (
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </Button>
              </span>
            </div>
          )}
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

