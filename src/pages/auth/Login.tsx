import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
          <CardDescription>
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                    inputText: 'white',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                anchor: 'text-primary hover:text-primary/80',
                input: 'text-white bg-background',
                label: 'text-foreground',
              },
            }}
            providers={[]}
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
                  link_text: "Já tem uma conta? Entre",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  password_input_placeholder: "Escolha uma senha",
                  button_label: "Cadastrar",
                  loading_button_label: "Cadastrando...",
                  social_provider_text: "Cadastre-se com {{provider}}",
                  link_text: "Não tem uma conta? Cadastre-se",
                },
                forgotten_password: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "seu@email.com",
                  button_label: "Enviar instruções",
                  loading_button_label: "Enviando instruções...",
                  link_text: "Esqueceu sua senha?",
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