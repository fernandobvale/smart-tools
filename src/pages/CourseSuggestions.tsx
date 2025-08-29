
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SuggestionModal } from "@/components/course-suggestions/SuggestionModal";
import { SuggestionsTable } from "@/components/course-suggestions/SuggestionsTable";
import { supabase } from "@/integrations/supabase/client";
import { CourseSuggestion } from "@/components/course-suggestions/types";

const CourseSuggestions = () => {
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
      const { data, error } = await supabase
        .from('course_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sugestões:', error);
        return;
      }

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
    setRefreshTrigger(prev => prev + 1);
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
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Sugestão
        </Button>
      </div>

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
