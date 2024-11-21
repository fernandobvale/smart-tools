import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseForm } from "@/components/courses/CourseForm";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export default function CourseManagement() {
  const [editor, setEditor] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: courses, refetch } = useQuery({
    queryKey: ["courses", editor, paymentStatus],
    queryFn: async () => {
      let query = supabase.from("cursos").select("*").order("created_at", { ascending: false });

      if (editor) {
        query = query.ilike("nome_editor", `%${editor}%`);
      }

      if (paymentStatus) {
        query = query.eq("status_pagamento", paymentStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Cursos</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Curso</DialogTitle>
            </DialogHeader>
            <CourseForm onSuccess={() => {
              setIsFormOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <CourseFilters
        editor={editor}
        onEditorChange={setEditor}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
      />

      <CourseTable courses={courses || []} onUpdate={refetch} />
    </div>
  );
}