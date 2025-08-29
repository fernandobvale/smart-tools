
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CourseComplaint } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ComplaintsTableProps {
  complaints: CourseComplaint[];
  refreshTrigger: number;
  onUpdate: () => void;
}

export const ComplaintsTable = ({ complaints, onUpdate }: ComplaintsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CourseComplaint>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não logado');
        return;
      }

      console.log('Verificando admin para usuário:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      console.log('Resultado da verificação admin:', { data, error });
      if (!error && data) {
        setIsAdmin(true);
        console.log('Usuário é admin');
      } else {
        console.log('Usuário não é admin ou não encontrado');
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
    }
  };

  const startEdit = (complaint: CourseComplaint) => {
    setEditingId(complaint.id);
    setEditData({
      course: complaint.course,
      school: complaint.school,
      complaint: complaint.complaint,
      analyst: complaint.analyst,
      action_taken: complaint.action_taken,
      status: complaint.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('course_complaints')
        .update(editData)
        .eq('id', editingId);

      if (error) {
        console.error('Erro ao atualizar reclamação:', error);
        toast.error("Erro ao atualizar reclamação. Tente novamente.");
        return;
      }

      toast.success("Reclamação atualizada com sucesso!");
      setEditingId(null);
      setEditData({});
      onUpdate();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado. Tente novamente.");
    }
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

  return (
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
                {editingId === complaint.id ? (
                  <Input
                    value={editData.course || ''}
                    onChange={(e) => setEditData({ ...editData, course: e.target.value })}
                  />
                ) : (
                  complaint.course
                )}
              </TableCell>
              
              <TableCell className="min-w-[150px]">
                {editingId === complaint.id ? (
                  <Input
                    value={editData.school || ''}
                    onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                  />
                ) : (
                  complaint.school
                )}
              </TableCell>
              
              <TableCell className="max-w-[300px]">
                {editingId === complaint.id ? (
                  <Textarea
                    value={editData.complaint || ''}
                    onChange={(e) => setEditData({ ...editData, complaint: e.target.value })}
                    className="min-h-[60px]"
                  />
                ) : (
                  <div className="line-clamp-3 text-sm">{complaint.complaint}</div>
                )}
              </TableCell>
              
              <TableCell className="min-w-[120px]">
                {editingId === complaint.id ? (
                  <Select
                    value={editData.status || complaint.status}
                    onValueChange={(value) => setEditData({ ...editData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aberta">Aberta</SelectItem>
                      <SelectItem value="Em Análise">Em Análise</SelectItem>
                      <SelectItem value="Resolvida">Resolvida</SelectItem>
                      <SelectItem value="Não Procede">Não Procede</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                )}
              </TableCell>
              
              <TableCell className="min-w-[150px]">
                {editingId === complaint.id ? (
                  <Input
                    value={editData.analyst || ''}
                    onChange={(e) => setEditData({ ...editData, analyst: e.target.value })}
                  />
                ) : (
                  complaint.analyst || '-'
                )}
              </TableCell>
              
              <TableCell className="max-w-[250px]">
                {editingId === complaint.id ? (
                  <Textarea
                    value={editData.action_taken || ''}
                    onChange={(e) => setEditData({ ...editData, action_taken: e.target.value })}
                    className="min-h-[60px]"
                  />
                ) : (
                  <div className="line-clamp-3 text-sm">{complaint.action_taken || '-'}</div>
                )}
              </TableCell>
              
              {isAdmin && (
                <TableCell className="min-w-[120px]">
                  {editingId === complaint.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={saveEdit}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEdit(complaint)}>
                      Editar
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
