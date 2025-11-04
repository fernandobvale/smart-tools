
import React, { useMemo, useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Menu, Home } from "lucide-react";
import * as Icons from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTools } from "@/hooks/useTools";

const DashboardLayout = () => {
  const { signOut } = useAuth();
  const { tools, isLoading } = useTools();
  
  // Load open categories from localStorage
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('sidebar-open-categories');
    return saved ? JSON.parse(saved) : ['Geral'];
  });

  // Save open categories to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-open-categories', JSON.stringify(openCategories));
  }, [openCategories]);

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof tools> = {};
    
    tools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });

    // Sort tools within each category alphabetically
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Sort categories alphabetically
    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {} as Record<string, typeof tools>);
  }, [tools]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Menu
          </h2>
        </div>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-3">
            {/* Dashboard always visible */}
            <Button variant="ghost" asChild className="w-full justify-start mb-2">
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => 
                  isActive ? "bg-secondary text-secondary-foreground" : ""
                }
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </NavLink>
            </Button>
            
            <Separator className="my-2" />
            
            {/* Accordion by categories */}
            {!isLoading && (
              <Accordion 
                type="multiple" 
                value={openCategories}
                onValueChange={setOpenCategories}
                className="w-full"
              >
                {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
                  <AccordionItem key={category} value={category} className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-4">
                        {categoryTools.map((tool) => {
                          const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;
                          
                          if (tool.external) {
                            return (
                              <Button
                                key={tool.id}
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <a 
                                  href={tool.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <IconComponent className="mr-2 h-4 w-4" />
                                  {tool.name}
                                </a>
                              </Button>
                            );
                          }
                          
                          return (
                            <Button
                              key={tool.id}
                              asChild
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <NavLink 
                                to={tool.href}
                                className={({ isActive }) => 
                                  isActive ? "bg-secondary text-secondary-foreground" : ""
                                }
                              >
                                <IconComponent className="mr-2 h-4 w-4" />
                                {tool.name}
                              </NavLink>
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {isLoading && (
              <p className="text-sm text-muted-foreground p-2">Carregando...</p>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
