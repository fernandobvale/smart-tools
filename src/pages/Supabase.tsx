
import { Database } from "lucide-react";
import { SupabaseProjectsList } from "@/components/supabase/SupabaseProjectsList";

export default function Supabase() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-8 h-8 text-violet-600" />
        <h1 className="text-2xl font-bold">Gerenciamento de Projetos Supabase</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Armazene de forma segura e gerencie facilmente as credenciais e dados dos seus projetos Supabase.
      </p>
      <SupabaseProjectsList />
    </div>
  );
}
