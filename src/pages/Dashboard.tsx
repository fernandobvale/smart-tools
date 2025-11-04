import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { AddToolDialog } from "@/components/dashboard/AddToolDialog";
import { useTools } from "@/hooks/useTools";

const Dashboard = () => {
  const { tools, isLoading } = useTools();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map(t => t.category)));
    return cats.sort();
  }, [tools]);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    return tools
      .filter(tool => {
        const matchesSearch = 
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          tool.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = 
          categoryFilter === "all" || tool.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tools, search, categoryFilter]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">Carregando ferramentas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Dashboard
            <Sparkles className="w-7 h-7 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredTools.length} {filteredTools.length === 1 ? 'ferramenta disponível' : 'ferramentas disponíveis'}
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="🔍 Buscar ferramenta..." 
            className="flex-1 md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma ferramenta encontrada com os filtros aplicados.
          </p>
        </div>
      )}

      <Button 
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setDialogOpen(true)}
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddToolDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Dashboard;
