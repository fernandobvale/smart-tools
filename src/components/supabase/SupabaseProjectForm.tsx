import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import bcrypt from "bcryptjs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoTooltip } from "./InfoTooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const formSchema = z.object({
  project_name: z.string().min(2, "Nome obrigatório"),
  user_email: z.string().email("Email inválido"),
  user_password: z.string().optional(),
  supabase_url: z.string().url("URL inválida"),
  anon_key: z.string().min(1, "Obrigatório"),
  service_role_key: z.string().min(1, "Obrigatório"),
  project_id: z.string().min(2, "Obrigatório"),
  dashboard_url: z.string().url("URL inválida"),
  db_host: z.string().min(3, "Obrigatório"),
  db_port: z.coerce.number().int().min(1).default(5432),
  db_user: z.string().min(1, "Obrigatório"),
  db_password: z.string().min(1, "Obrigatório"),
  db_name: z.string().min(1, "Obrigatório").default("postgres"),
});

type FormValues = z.infer<typeof formSchema> & { id?: string };

interface Props {
  defaultValues?: Partial<FormValues>;
  onSubmitDone: () => void;
}

export function SupabaseProjectForm({ defaultValues, onSubmitDone }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      db_port: defaultValues?.db_port || 5432,
      db_name: defaultValues?.db_name || "postgres",
    },
  });

  const [pwVisible, setPwVisible] = useState(false);
  const [dbPwVisible, setDbPwVisible] = useState(false);

  async function handleSubmit(values: FormValues) {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
        return;
      }

      // Hash the user password if filled
      let user_password_hash = undefined;
      if (values.user_password) {
        user_password_hash = await bcrypt.hash(values.user_password, 10);
      }

      if (defaultValues?.id) {
        // Update
        const { error } = await supabase
          .from("supabase_projects")
          .update({
            project_name: values.project_name,
            user_email: values.user_email,
            user_password_hash,
            supabase_url: values.supabase_url,
            anon_key: values.anon_key,
            service_role_key: values.service_role_key,
            project_id: values.project_id,
            dashboard_url: values.dashboard_url,
            db_host: values.db_host,
            db_port: values.db_port,
            db_user: values.db_user,
            db_password: values.db_password,
            db_name: values.db_name,
          })
          .eq("id", defaultValues.id);
        if (error) throw error;
        toast({ title: "Projeto atualizado com sucesso" });
      } else {
        // Insert
        const { error } = await supabase.from("supabase_projects").insert([
          {
            project_name: values.project_name,
            user_email: values.user_email,
            user_password_hash,
            supabase_url: values.supabase_url,
            anon_key: values.anon_key,
            service_role_key: values.service_role_key,
            project_id: values.project_id,
            dashboard_url: values.dashboard_url,
            db_host: values.db_host,
            db_port: values.db_port,
            db_user: values.db_user,
            db_password: values.db_password,
            db_name: values.db_name,
            user_id: session.user.id,
          },
        ]);
        if (error) throw error;
        toast({ title: "Projeto salvo com sucesso" });
      }
      form.reset();
      onSubmitDone();
    } catch (error: any) {
      toast({ title: "Erro ao salvar projeto", description: error.message, variant: "destructive" });
    }
  }

  const copyToClipboard = (value: string | undefined) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({ title: "Copiado para área de transferência" });
  };

  const renderPwField = (
    name: "user_password" | "db_password",
    label: React.ReactNode,
    visible: boolean,
    setVisible: (v: boolean) => void
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative flex items-center">
            <FormControl>
              <Input
                {...field}
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                className="pr-10"
              />
            </FormControl>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setVisible(!visible)}
              className="absolute right-7 text-muted-foreground"
              aria-label={visible ? "Ocultar" : "Mostrar"}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {field.value && (
              <button
                type="button"
                tabIndex={-1}
                className="ml-2 absolute right-0"
                onClick={() => copyToClipboard(field.value)}
                aria-label="Copiar"
              >
                <ClipboardCopy size={18} />
              </button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Informações de onde encontrar cada campo (pt-br)
  const info = {
    project_name:
      "Nome personalizável para você identificar o projeto. Não precisa ser igual ao nome no Supabase.",
    user_email:
      "Email do usuário administrador do projeto no Supabase ou o email principal cadastrado.",
    user_password:
      "Senha do usuário administrador, se desejar salvar. Não é obrigatório.",
    supabase_url:
      "No Supabase: Home > Projeto > Settings > API > Project URL.",
    anon_key:
      "No Supabase: Home > Projeto > Settings > API > Project API keys > anon public.",
    service_role_key:
      "No Supabase: Home > Projeto > Settings > API > Project API keys > service_role.",
    project_id:
      "No Supabase: Home > Projeto. O ID aparece na URL da dashboard (https://app.supabase.com/project/[ID]).",
    dashboard_url:
      "Normalmente: https://app.supabase.com/project/[Project ID]. Substitua pelo ID correto.",
    db_host:
      "No Supabase: Home > Projeto > Settings > Database > Host.",
    db_port:
      "No Supabase: Home > Projeto > Settings > Database > Port (padrão: 5432).",
    db_user:
      "No Supabase: Home > Projeto > Settings > Database > User (padrão: postgres).",
    db_password:
      "No Supabase: Home > Projeto > Settings > Database > Password.",
    db_name:
      "Nome do banco padrão é 'postgres', mas pode ser alterado se você criou outro banco.",
  };

  // Links diretos (opcional)
  const projectDashboardLink = "https://app.supabase.com/project";
  const settingsApiLink = "https://app.supabase.com/project/_/settings/api";
  const settingsDbLink = "https://app.supabase.com/project/_/settings/database";

  // We'll manage which tab/step is active
  const [step, setStep] = useState<"project" | "db">("project");

  return (
    <ScrollArea className="max-h-[80vh] pr-2">
      <Form {...form}>
        <Tabs value={step} onValueChange={setStep}>
          <TabsList className="w-full flex justify-around mb-4">
            <TabsTrigger value="project" className="w-full">Dados do Projeto</TabsTrigger>
            <TabsTrigger value="db" className="w-full">Banco de Dados</TabsTrigger>
          </TabsList>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TabsContent value="project" forceMount>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Nome do projeto e Email */}
                <FormField
                  control={form.control}
                  name="project_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome do Projeto *
                        <InfoTooltip description={info.project_name} />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Meu Projeto Supabase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email do Usuário *
                        <InfoTooltip description={info.user_email} />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="usuario@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {renderPwField(
                "user_password",
                <>
                  Senha do Usuário (opcional)
                  <InfoTooltip description={info.user_password} />
                </>,
                pwVisible,
                setPwVisible
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supabase_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supabase URL *
                        <InfoTooltip
                          description={info.supabase_url}
                          link={settingsApiLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://xyzcompany.supabase.co" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anon_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Anon Key *
                        <InfoTooltip
                          description={info.anon_key}
                          link={settingsApiLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="service_role_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Service Role Key *
                        <InfoTooltip
                          description={info.service_role_key}
                          link={settingsApiLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ID do Projeto *
                        <InfoTooltip
                          description={info.project_id}
                          link={projectDashboardLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="xyzcompany" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dashboard_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link do Painel (Dashboard) *
                      <InfoTooltip
                        description={info.dashboard_url}
                        link={projectDashboardLink}
                      />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://app.supabase.com/project/xyzcompany" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="button" onClick={() => setStep("db")}>
                  Próximo: Banco de Dados
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="db" forceMount>
              <div className="font-semibold text-xl pb-2 flex items-center gap-2">
                🛢️ Banco de Dados PostgreSQL
                <InfoTooltip description="Estas informações ficam em Settings > Database no painel do Supabase." link={settingsDbLink} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="db_host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Host *
                        <InfoTooltip
                          description={info.db_host}
                          link={settingsDbLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="db.xyzcompany.supabase.co" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="db_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Porta *
                        <InfoTooltip
                          description={info.db_port}
                          link={settingsDbLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="5432" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="db_user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Usuário *
                        <InfoTooltip
                          description={info.db_user}
                          link={settingsDbLink}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="postgres" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {renderPwField(
                "db_password",
                <>
                  Senha do Banco de Dados *
                  <InfoTooltip description={info.db_password} link={settingsDbLink} />
                </>,
                dbPwVisible,
                setDbPwVisible
              )}
              <FormField
                control={form.control}
                name="db_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome do banco *
                      <InfoTooltip description={info.db_name} link={settingsDbLink} />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="postgres" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep("project")}>
                  Voltar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {defaultValues?.id ? "Salvar Alterações" : "Salvar Projeto"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </Form>
    </ScrollArea>
  );
}
