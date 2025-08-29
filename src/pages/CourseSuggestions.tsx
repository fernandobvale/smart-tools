
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SuggestionModal } from "@/components/course-suggestions/SuggestionModal";
import { SuggestionsTable } from "@/components/course-suggestions/SuggestionsTable";
import { supabase } from "@/integrations/supabase/client";
import { CourseSuggestion } from "@/components/course-suggestions/types";
import { useAuth } from "@/components/auth/AuthProvider";

const CourseSuggestions = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Adicionar meta tag para não indexar a página
  useEffect(() => {
    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      console.log('Buscando sugestões...');
      const { data, error } = await supabase
        .from('course_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sugestões:', error);
        return;
      }

      console.log('Sugestões carregadas:', data?.length || 0);
      setSuggestions(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [refreshTrigger]);

  const handleSuggestionSubmitted = () => {
    console.log('Sugestão enviada, recarregando lista...');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRegisterClick = () => {
    console.log('Botão registrar clicado. Usuário logado:', !!user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sugestões de Curso</h1>
          <p>Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sugestões de Curso</h1>
          <p className="text-muted-foreground mt-2">
            Sistema para registro e acompanhamento de sugestões de novos cursos
          </p>
        </div>
        
        <Button onClick={handleRegisterClick}>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Sugestão
        </Button>
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Dica:</strong> Você pode sugerir cursos mesmo sem fazer login! 
            Clique em "Registrar Sugestão" acima ou em qualquer linha da tabela para ver mais detalhes.
          </p>
        </div>
      )}

      <div className="bg-card rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Sugestões Registradas ({suggestions.length})
          </h2>
        </div>
        
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma sugestão registrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <SuggestionsTable 
              suggestions={suggestions}
              refreshTrigger={refreshTrigger}
              onUpdate={handleSuggestionSubmitted}
            />
          </div>
        )}
      </div>

      <SuggestionModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuggestionSubmitted={handleSuggestionSubmitted}
      />
    </div>
  );
};

export default CourseSuggestions;
