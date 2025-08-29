
import { useState, useEffect } from "react";
import { CourseComplaintForm } from "@/components/course-complaints/CourseComplaintForm";
import { CourseComplaintsList } from "@/components/course-complaints/CourseComplaintsList";

const CourseComplaints = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Adicionar meta tag para não indexar a página
  useEffect(() => {
    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    // Cleanup: remover a meta tag quando o componente for desmontado
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  const handleComplaintSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Reclamações de Curso</h1>
        <p className="text-muted-foreground">
          Sistema para registro e acompanhamento de reclamações relacionadas a cursos
        </p>
      </div>
      
      <CourseComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
      <CourseComplaintsList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default CourseComplaints;
