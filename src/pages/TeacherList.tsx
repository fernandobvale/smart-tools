import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface Teacher {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  about: string;
  photo_url: string | null;
  status: string;
}

const TeacherList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const { isLoading, refetch } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Erro ao carregar a lista de professores");
        throw error;
      }
      return data as Teacher[];
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleStatusChange = async () => {
    if (!selectedTeacher || !newStatus) return;

    try {
      const { error } = await supabase
        .from("teachers")
        .update({ status: newStatus })
        .eq("id", selectedTeacher.id);

      if (error) {
        console.error("Error updating teacher status:", error);
        toast.error("Erro ao atualizar o status do professor");
        return;
      }

      toast.success("Status do professor atualizado com sucesso!");
      setOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating teacher status:", error);
      toast.error("Erro ao atualizar o status do professor");
    }
  };

  const handleOpenChange = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setNewStatus(teacher.status);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Professores</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                {teacher.photo_url ? (
                  <AvatarImage src={teacher.photo_url} alt={teacher.full_name} />
                ) : (
                  <AvatarFallback>{teacher.full_name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{teacher.full_name}</h2>
                <p className="text-sm text-gray-500">{teacher.email}</p>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{teacher.about}</p>
            <div className="mt-4">
              <p className="text-sm font-medium">
                Status:{" "}
                <span className="uppercase font-bold">{teacher.status}</span>
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenChange(teacher)}
                    className="mt-2 w-full"
                  >
                    Alterar Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Status do Professor</DialogTitle>
                    <DialogDescription>
                      Selecione o novo status para {selectedTeacher?.full_name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Input
                        type="text"
                        id="status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button type="submit" onClick={handleStatusChange}>
                    Salvar
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherList;
