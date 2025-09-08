
import { Database, User, LogIn } from "lucide-react";
import { SupabaseProjectsList } from "@/components/supabase/SupabaseProjectsList";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function Supabase() {
  const { user, session, signOut } = useAuth();
  const isAuthenticated = !!session && !!user;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-violet-600" />
          <h1 className="text-2xl font-bold">Gerenciamento de Projetos Supabase</h1>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {user.email}
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground mb-6">
        Armazene de forma segura e gerencie facilmente as credenciais e dados dos seus projetos Supabase.
      </p>
      
      {!isAuthenticated && (
        <Alert className="mb-6 border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-600">
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            <strong>Login necessário:</strong> Você precisa estar logado para gerenciar projetos Supabase.
            <br />
            <Link to="/login" className="underline font-medium mt-2 inline-block">
              Fazer login agora
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <SupabaseProjectsList />
    </div>
  );
}
