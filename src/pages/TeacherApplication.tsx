import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TeacherApplication {
  id: string;
  created_at: string;
  updated_at: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  endereco: string;
  formacao: string;
  experiencia: string;
  cursos_desejados: string;
  disponibilidade: string;
  observacoes: string | null;
  status: "pendente" | "aprovado" | "rejeitado";
}

export default function TeacherApplication() {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"pendente" | "aprovado" | "rejeitado">("pendente");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: applications, refetch } = useQuery({
    queryKey: ["teacherApplications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TeacherApplication[];
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleCheckboxChange = (applicationId: string) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleStatusUpdate = async () => {
    try {
      const { error } = await supabase
        .from("teacher_applications")
        .update({ status: newStatus })
        .in("id", selectedApplications);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      setSelectedApplications([]);
      setStatusUpdateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar o status");
    }
  };

  const filteredApplications = applications?.filter((application) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      application.nome_completo.toLowerCase().includes(searchLower) ||
      application.email.toLowerCase().includes(searchLower) ||
      application.cpf.includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">
        Gerenciamento de Aplicações de Professores
      </h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="space-x-2">
          <Button
            onClick={() => setStatusUpdateDialogOpen(true)}
            disabled={selectedApplications.length === 0}
          >
            Atualizar Status
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Atualizar Lista
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedApplications.length === filteredApplications?.length &&
                    filteredApplications?.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedApplications(
                        filteredApplications.map((app) => app.id)
                      );
                    } else {
                      setSelectedApplications([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Data de Aplicação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onCheckedChange={() => handleCheckboxChange(application.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{application.nome_completo}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.cpf}</TableCell>
                <TableCell>{formatDate(application.created_at)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      application.status === "aprovado"
                        ? "success"
                        : application.status === "rejeitado"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Aplicação</DialogTitle>
                        <DialogDescription>
                          Informações completas sobre a aplicação de{" "}
                          {application.nome_completo}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Nome Completo</Label>
                            <Input
                              type="text"
                              value={application.nome_completo}
                              readOnly
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input type="email" value={application.email} readOnly />
                          </div>
                          <div>
                            <Label>Telefone</Label>
                            <Input type="tel" value={application.telefone} readOnly />
                          </div>
                          <div>
                            <Label>CPF</Label>
                            <Input type="text" value={application.cpf} readOnly />
                          </div>
                          <div>
                            <Label>Data de Nascimento</Label>
                            <Input
                              type="text"
                              value={formatDate(application.data_nascimento)}
                              readOnly
                            />
                          </div>
                          <div>
                            <Label>Endereço</Label>
                            <Input type="text" value={application.endereco} readOnly />
                          </div>
                        </div>
                        <div>
                          <Label>Formação</Label>
                          <Textarea value={application.formacao} readOnly />
                        </div>
                        <div>
                          <Label>Experiência</Label>
                          <Textarea value={application.experiencia} readOnly />
                        </div>
                        <div>
                          <Label>Cursos Desejados</Label>
                          <Textarea value={application.cursos_desejados} readOnly />
                        </div>
                        <div>
                          <Label>Disponibilidade</Label>
                          <Input type="text" value={application.disponibilidade} readOnly />
                        </div>
                        <div>
                          <Label>Observações</Label>
                          <Textarea value={application.observacoes || ""} readOnly />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={statusUpdateDialogOpen} onOpenChange={setStatusUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status</DialogTitle>
            <DialogDescription>
              Selecione o novo status para as aplicações selecionadas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="status">Novo Status</Label>
            <select
              id="status"
              className="rounded-md border shadow-sm focus:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as "pendente" | "aprovado" | "rejeitado")
              }
            >
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStatusUpdateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleStatusUpdate}>
              Atualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
