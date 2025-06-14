
import * as React from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

interface TeacherApplicationLite {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  whatsapp: string;
  academic_background: string;
}

const TeacherList = () => {
  const [applications, setApplications] = useState<TeacherApplicationLite[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TeacherApplicationLite | null>(null);

  const { isLoading, refetch, data } = useQuery({
    queryKey: ["teacher_applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_applications")
        .select("id, created_at, full_name, email, whatsapp, academic_background")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        toast.error("Erro ao carregar a lista de candidatos");
        throw error;
      }
      return data as TeacherApplicationLite[];
    },
  });

  useEffect(() => {
    if (data) setApplications(data);
  }, [data]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Candidatos a Professor</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-lg font-semibold text-gray-600">
                {person.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{person.full_name}</h2>
                <p className="text-sm text-gray-500">{person.email}</p>
              </div>
            </div>
            <p className="mt-2 text-gray-700 line-clamp-2">{person.academic_background}</p>
            <div className="mt-4">
              <Dialog open={open && selected?.id === person.id} onOpenChange={(v) => { if (!v) setOpen(false); }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { setSelected(person); setOpen(true); }}
                    className="mt-2 w-full"
                  >
                    Ver Detalhes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detalhes do Candidato</DialogTitle>
                    <DialogDescription>
                      Informações sobre {person.full_name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input type="text" value={person.full_name} readOnly />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={person.email} readOnly />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input type="tel" value={person.whatsapp} readOnly />
                    </div>
                    <div>
                      <Label>Formação</Label>
                      <Input type="text" value={person.academic_background} readOnly />
                    </div>
                  </div>
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
