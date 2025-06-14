import { CourseTable } from "@/components/courses/CourseTable";
import { CourseForm } from "@/components/courses/CourseForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FixLegacyDataButton } from "@/components/tools/FixLegacyDataButton";

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  const { refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
      setCourses(data);
      return data;
    },
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao Painel</h1>
      <FixLegacyDataButton />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lançamentos</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Criar Lançamento
        </Button>
      </div>

      <CourseTable courses={courses} onUpdate={refetch} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Lançamento</DialogTitle>
          </DialogHeader>
          <CourseForm onSuccess={() => {
            setIsCreateDialogOpen(false);
            refetch();
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
