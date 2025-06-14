
import { Database } from "lucide-react";

export default function Supabase() {
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-8 h-8 text-violet-600" />
        <h1 className="text-2xl font-bold">Gerenciamento Supabase</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Em breve: gerencie e salve com segurança as senhas dos seus projetos Supabase por aqui.
      </p>
      {/* Conteúdo futuro para gerenciamento de senhas ficará aqui */}
      <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground opacity-80">
        Funcionalidade em desenvolvimento.
      </div>
    </div>
  );
}
