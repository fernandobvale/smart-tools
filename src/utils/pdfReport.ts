import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format, parseISO } from "date-fns";

interface Course {
  nome_curso: string;
  numero_aulas: number;
  data_entrega: string;
  valor: number;
  data_pagamento: string | null;
  status_pagamento: string;
  nome_editor: string;
}

export const generatePDFReport = (courses: Course[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Relatório de Cursos", 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 22);

  // Calculate total
  const total = courses.reduce((sum, course) => sum + Number(course.valor), 0);

  // Add table
  autoTable(doc, {
    startY: 30,
    head: [["Curso", "Editor", "Aulas", "Entrega", "Valor", "Status"]],
    body: courses.map((course) => [
      course.nome_curso,
      course.nome_editor,
      course.numero_aulas,
      format(parseISO(course.data_entrega), "dd/MM/yyyy"),
      `R$ ${Number(course.valor).toFixed(2)}`,
      course.status_pagamento,
    ]),
    foot: [["Total", "", "", "", `R$ ${total.toFixed(2)}`, ""]],
  });

  doc.save("relatorio-cursos.pdf");
};