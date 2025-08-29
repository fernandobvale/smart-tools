
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CourseComplaint } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { EditComplaintModal } from "./EditComplaintModal";

interface ComplaintsTableProps {
  complaints: CourseComplaint[];
  refreshTrigger: number;
  onUpdate: () => void;
}

export const ComplaintsTable = ({ complaints, onUpdate }: ComplaintsTableProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<CourseComplaint | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsCheckingAdmin(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não logado');
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

  const handleEditClick = (complaint: CourseComplaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

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
              <TableHead>Curso</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Reclamação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Ação Tomada</TableHead>
              <TableHead>Feedback/Observação</TableHead>
              {isAdmin && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="min-w-[100px]">
                  {format(new Date(complaint.complaint_date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {complaint.course}
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {complaint.school}
                </TableCell>
                
                <TableCell className="max-w-[300px]">
                  <div className="line-clamp-3 text-sm">{complaint.complaint}</div>
                </TableCell>
                
                <TableCell className="min-w-[120px]">
                  <Badge variant={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                </TableCell>
                
                <TableCell className="min-w-[150px]">
                  {complaint.analyst || '-'}
                </TableCell>
                
                <TableCell className="max-w-[250px]">
                  <div className="line-clamp-3 text-sm">{complaint.action_taken || '-'}</div>
                </TableCell>

                <TableCell className="max-w-[250px]">
                  <div className="line-clamp-3 text-sm">{complaint.feedback || '-'}</div>
                </TableCell>
                
                {isAdmin && (
                  <TableCell className="min-w-[120px]">
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(complaint)}>
                      Editar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditComplaintModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        complaint={selectedComplaint}
        onUpdated={onUpdate}
      />
    </>
  );
};
