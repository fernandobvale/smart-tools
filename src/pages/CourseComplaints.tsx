
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComplaintModal } from "@/components/course-complaints/ComplaintModal";
import { ComplaintsTable } from "@/components/course-complaints/ComplaintsTable";
import { supabase } from "@/integrations/supabase/client";
import { CourseComplaint } from "@/components/course-complaints/types";

const CourseComplaints = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaints, setComplaints] = useState<CourseComplaint[]>([]);
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

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('course_complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar reclamações:', error);
        return;
      }

      setComplaints(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [refreshTrigger]);

  const handleComplaintSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Reclamações de Curso</h1>
          <p>Carregando reclamações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reclamações de Curso</h1>
          <p className="text-muted-foreground mt-2">
            Sistema para registro e acompanhamento de reclamações relacionadas a cursos
          </p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Reclamação
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Reclamações Registradas ({complaints.length})
          </h2>
        </div>
        
        {complaints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma reclamação registrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ComplaintsTable 
              complaints={complaints}
              refreshTrigger={refreshTrigger}
              onUpdate={handleComplaintSubmitted}
            />
          </div>
        )}
      </div>

      <ComplaintModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onComplaintSubmitted={handleComplaintSubmitted}
      />
    </div>
  );
};

export default CourseComplaints;
