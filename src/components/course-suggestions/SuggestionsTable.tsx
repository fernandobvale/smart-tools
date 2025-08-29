
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CourseSuggestion } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditSuggestionModal } from "./EditSuggestionModal";
import { SuggestionDetailsModal } from "./SuggestionDetailsModal";
import { useAuth } from "@/components/auth/AuthProvider";

interface SuggestionsTableProps {
  suggestions: CourseSuggestion[];
  refreshTrigger: number;
  onUpdate: () => void;
}

export const SuggestionsTable = ({ suggestions, onUpdate }: SuggestionsTableProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CourseSuggestion | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setIsCheckingAdmin(true);
      
      if (!user) {
        console.log('Usuário não logado');
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      console.log('Verificando admin para usuário:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('Resultado da verificação admin:', { data, error });
      if (!error && data) {
        setIsAdmin(true);
        console.log('Usuário é admin');
      } else {
        setIsAdmin(false);
        console.log('Usuário não é admin ou não encontrado');
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const handleRowClick = (suggestion: CourseSuggestion) => {
    console.log('Clicou na linha da sugestão:', suggestion.id);
    setSelectedSuggestion(suggestion);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, suggestion: CourseSuggestion) => {
    e.stopPropagation(); // Evita que o clique na linha seja acionado
    console.log('Clicou no botão editar:', suggestion.id);
    setSelectedSuggestion(suggestion);
    setIsEditModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSuggestion(null);
  };

  if (isCheckingAdmin) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p>Carregando permissões...</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Curso Sugerido</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Atendente Responsável</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Buscas na Internet</TableHead>
              <TableHead>Curso Criado?</TableHead>
              {(isAdmin && user) && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.map((suggestion) => (
              <TableRow 
                key={suggestion.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(suggestion)}
              >
                <TableCell className="min-w-[100px]">
                  {format(new Date(suggestion.suggestion_date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {suggestion.suggested_course}
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {suggestion.school}
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {suggestion.attendant}
                </TableCell>
                
                <TableCell className="max-w-[250px]">
                  <div className="line-clamp-3 text-sm">{suggestion.observations || '-'}</div>
                </TableCell>
                
                <TableCell className="max-w-[250px]">
                  <div className="line-clamp-3 text-sm">{suggestion.internet_searches}</div>
                </TableCell>
                
                <TableCell className="min-w-[120px]">
                  <Badge variant={suggestion.course_created ? "default" : "secondary"}>
                    {suggestion.course_created ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                
                {(isAdmin && user) && (
                  <TableCell className="min-w-[120px]">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => handleEditClick(e, suggestion)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SuggestionDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleDetailsModalClose}
        suggestion={selectedSuggestion}
      />

      {user && (
        <EditSuggestionModal
          open={isEditModalOpen}
          onOpenChange={handleEditModalClose}
          suggestion={selectedSuggestion}
          onUpdated={onUpdate}
        />
      )}
    </>
  );
};
