
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CourseComplaint } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CourseComplaintsListProps {
  refreshTrigger: number;
}

export const CourseComplaintsList = ({ refreshTrigger }: CourseComplaintsListProps) => {
  const [complaints, setComplaints] = useState<CourseComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('course_complaints')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'destructive';
      case 'Em Análise':
        return 'secondary';
      case 'Resolvida':
        return 'default';
      case 'Não Procede':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reclamações Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando reclamações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reclamações Registradas ({complaints.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {complaints.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma reclamação registrada ainda.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{complaint.course}</h3>
                    <p className="text-sm text-muted-foreground">{complaint.school}</p>
                  </div>
                  <Badge variant={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                </div>
                
                <p className="text-sm">{complaint.complaint}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>
                    <strong>Data da Reclamação:</strong>{' '}
                    {format(new Date(complaint.complaint_date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                  <p>
                    <strong>Registrado em:</strong>{' '}
                    {format(new Date(complaint.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                
                {complaint.analyst && (
                  <p className="text-xs">
                    <strong>Responsável:</strong> {complaint.analyst}
                  </p>
                )}
                
                {complaint.action_taken && (
                  <div className="bg-muted p-2 rounded text-xs">
                    <strong>Ação Tomada:</strong> {complaint.action_taken}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
