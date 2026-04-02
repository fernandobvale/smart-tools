
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

const Login = () => {
  const { session } = useAuth();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        toast.error("Credenciais inválidas");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
          <CardDescription>Entre com sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(var(--primary))",
                    brandAccent: "hsl(var(--primary))",
                    inputText: "hsl(var(--foreground))",
                  },
                },
              },
              className: {
                container: "w-full",
                button: "w-full",
                anchor: "text-primary hover:text-primary/80",
                input: "bg-background text-foreground",
                label: "text-foreground",
              },
            }}
            providers={[]}
            view="sign_in"
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  password_input_placeholder: "Sua senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                  social_provider_text: "Entre com {{provider}}",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
