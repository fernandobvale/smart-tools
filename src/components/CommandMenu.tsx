import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigation, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const tools = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Voltar para o painel principal",
  },
  {
    title: "Divisor de Texto",
    href: "/text-splitter",
    description: "Divida textos longos em partes menores",
  },
  {
    title: "Recibos",
    href: "/receipts",
    description: "Gere e gerencie recibos facilmente",
  },
  {
    title: "Consulta CPF",
    href: "/cpf-consulta",
    description: "Consulte dados de CPF e veja histórico",
  },
  {
    title: "Gerador de SEO",
    href: "/seo-generator",
    description: "Gere descrições otimizadas para SEO utilizando IA",
  },
  {
    title: "Editor Markdown",
    href: "/markdown-editor",
    description: "Edite e visualize textos em Markdown em tempo real",
  },
  {
    title: "Notas",
    href: "/notes",
    description: "Crie e gerencie suas notas",
  },
  {
    title: "Gestão de Certificados",
    href: "/certificates/manage",
    description: "Gerencie e acompanhe o envio de certificados",
  },
  {
    title: "Lista de Professores",
    href: "/teacher-list",
    description: "Gerencie e visualize inscrições de professores",
  },
];

export function CommandMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
      >
        <Navigation className="mr-2 h-4 w-4" />
        <span className="hidden md:inline-flex">Atalhos</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {tools.map((tool) => (
              <CommandItem
                key={tool.href}
                onSelect={() => {
                  navigate(tool.href);
                  setOpen(false);
                }}
              >
                {tool.title}
                <span className="text-muted-foreground text-sm ml-2">
                  {tool.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Conta">
            <CommandItem
              onSelect={() => {
                signOut();
                setOpen(false);
              }}
              className="text-red-500 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}