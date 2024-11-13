import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { 
  Scissors, 
  LayoutDashboard,
  Music,
  Receipt,
  UserSearch
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: "/dashboard"
  },
  {
    title: "Divisor de Texto",
    icon: <Scissors className="w-4 h-4" />,
    href: "/text-splitter"
  },
  {
    title: "Conversor de Vídeo para Áudio",
    icon: <Music className="w-4 h-4" />,
    href: "/video-to-audio"
  },
  {
    title: "Recibos",
    icon: <Receipt className="w-4 h-4" />,
    href: "/receipts"
  },
  {
    title: "Consulta CPF",
    icon: <UserSearch className="w-4 h-4" />,
    href: "/cpf-consulta"
  }
];

export function Sidebar() {
  return (
    <div className="w-64 space-y-4 py-4 min-h-screen border-r bg-background">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Ferramentas
        </h2>
        <Separator />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)] px-2">
        <div className="space-y-1 p-2">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
                  isActive ? "bg-accent" : ""
                }`
              }
            >
              {item.icon}
              <span className="flex-1">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}