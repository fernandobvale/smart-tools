
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  // Table fields
  full_name: string;
  email: string;
  whatsapp: string;
  academic_background: string;
  teaching_experience: string;
  video_experience: string;
  motivation: string;
  privacy_accepted: boolean;
}

export default function TeacherApplication() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: applications, refetch } = useQuery({
    queryKey: ["teacher_applications"],
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

  const filteredApplications = applications?.filter((application) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      application.full_name.toLowerCase().includes(searchLower) ||
      application.email.toLowerCase().includes(searchLower) ||
      application.whatsapp.includes(searchTerm)
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
          placeholder="Buscar por nome, email ou WhatsApp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            Atualizar Lista
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Data de Aplicação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.full_name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.whatsapp}</TableCell>
                <TableCell>{formatDate(application.created_at)}</TableCell>
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
                          {application.full_name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Nome Completo</Label>
                            <Input
                              type="text"
                              value={application.full_name}
                              readOnly
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input type="email" value={application.email} readOnly />
                          </div>
                          <div>
                            <Label>WhatsApp</Label>
                            <Input type="tel" value={application.whatsapp} readOnly />
                          </div>
                        </div>
                        <div>
                          <Label>Formação Acadêmica</Label>
                          <Textarea value={application.academic_background} readOnly />
                        </div>
                        <div>
                          <Label>Experiência como Professor</Label>
                          <Textarea value={application.teaching_experience} readOnly />
                        </div>
                        <div>
                          <Label>Experiência em Vídeo</Label>
                          <Input type="text" value={application.video_experience} readOnly />
                        </div>
                        <div>
                          <Label>Motivação</Label>
                          <Textarea value={application.motivation} readOnly />
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
    </div>
  );
}
