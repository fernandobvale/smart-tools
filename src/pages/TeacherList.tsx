
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface TeacherApplication {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  academic_background: string;
  teaching_experience: string;
  video_experience: string;
  motivation: string;
  created_at: string;
}

export default function TeacherList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherApplication | null>(null);

  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teacher-applications"],
    queryFn: async () => {
      console.log("=== FETCHING TEACHER APPLICATIONS ===");
      const { data, error } = await supabase
        .from("teacher_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching teacher applications:", error);
        throw error;
      }
      
      console.log("Successfully fetched teacher applications:", data?.length || 0);
      return data as TeacherApplication[];
    },
  });

  const filteredTeachers = teachers?.filter(
    (teacher) =>
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teaching_experience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Lista de Professores Inscritos</h1>
        <a
          href="/teacher-application"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nova Inscrição
          </Button>
        </a>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou experiência profissional..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !filteredTeachers?.length ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhum professor encontrado.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-medium">{teacher.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      Ver Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Detalhes do Professor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-1">Nome Completo</h4>
                        <p>{teacher.full_name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Email</h4>
                        <p>{teacher.email}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">WhatsApp</h4>
                        <p>{teacher.whatsapp}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Formação Acadêmica</h4>
                        <p className="whitespace-pre-wrap">{teacher.academic_background}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Experiência como Professor</h4>
                        <p className="whitespace-pre-wrap">{teacher.teaching_experience}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Experiência com Gravação de Vídeos</h4>
                        <p>{teacher.video_experience === "sim" ? "Sim" : "Não"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Motivação</h4>
                        <p className="whitespace-pre-wrap">{teacher.motivation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Data de Inscrição</h4>
                        <p>
                          {new Date(teacher.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
