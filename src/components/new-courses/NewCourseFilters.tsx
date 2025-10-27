import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface NewCourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  professorFilter: string;
  onProfessorFilterChange: (value: string) => void;
}

export function NewCourseFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  professorFilter,
  onProfessorFilterChange,
}: NewCourseFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="active">Ativos (exceto Concluído)</SelectItem>
          <SelectItem value="Novo">Novo</SelectItem>
          <SelectItem value="Atualizar">Atualizar</SelectItem>
          <SelectItem value="Atualizando">Atualizando</SelectItem>
          <SelectItem value="Concluido">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-full md:w-[200px]">
        <Input
          placeholder="Filtrar por professor..."
          value={professorFilter}
          onChange={(e) => onProfessorFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
}
