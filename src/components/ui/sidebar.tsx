import { Link } from "react-router-dom";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { 
  ScissorsLinear, 
  LayoutDashboard
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: "/dashboard"
  },
  {
    title: "Divisor de Texto",
    icon: <ScissorsLinear className="w-4 h-4" />,
    href: "/text-splitter"
  }
];

export function Sidebar() {
  return (
    <div className="min-h-screen w-64 border-r bg-background">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Ferramentas</h2>
          <Separator />
        </div>
        <ScrollArea className="px-1">
          <div className="space-y-1 p-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}