import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseForm } from "@/components/courses/CourseForm";
import { CourseTable } from "@/components/courses/CourseTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { format } from "date-fns";

type PaymentStatus = "Pendente" | "Pago" | "Cancelado";

interface Course {
  id: string;
  nome_curso: string;
  numero_aulas: number;
  data_entrega: string;
  valor: number;
  data_pagamento: string | null;
  status_pagamento: PaymentStatus;
  nome_editor: string;
  created_at: string;
  updated_at: string;
}

export default function CourseManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editorFilter, setEditorFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: courses = [], refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data as Course[]);
    },
  });

  const filteredCourses = courses.filter(course => {
    const matchesEditor = editorFilter
      ? course.nome_editor.toLowerCase().includes(editorFilter.toLowerCase())
      : true;
    
    const matchesStatus = paymentStatusFilter
      ? course.status_pagamento === paymentStatusFilter
      : true;

    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;
      const courseDate = new Date(course.data_entrega);
      if (startDate && !endDate) {
        return courseDate >= new Date(startDate);
      }
      if (!startDate && endDate) {
        return courseDate <= new Date(endDate);
      }
      return courseDate >= new Date(startDate) && courseDate <= new Date(endDate);
    })();

    return matchesEditor && matchesStatus && matchesDateRange;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pagamento Editores</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lançamento</DialogTitle>
            </DialogHeader>
            <CourseForm onSuccess={() => {
              setIsFormOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <CourseFilters
        editor={editorFilter}
        onEditorChange={setEditorFilter}
        paymentStatus={paymentStatusFilter}
        onPaymentStatusChange={setPaymentStatusFilter}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <CourseTable courses={filteredCourses} onUpdate={refetch} />
    </div>
  );
}