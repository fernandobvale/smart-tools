import { jsPDF } from "jspdf";
import extenso from "extenso";

interface PDFData {
  amount: string;
  reference: string;
  date: string;
  payee: {
    full_name: string;
    pix_key: string;
    bank_name: string;
    cpf: string;
  };
}

export const generateReceiptPDF = async (data: PDFData): Promise<boolean> => {
  try {
    if (!data.payee || !data.amount || !data.reference || !data.date) {
      console.error("Missing required data for PDF generation");
      return false;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const leftMargin = 20;
    const rightMargin = 20;
    const textWidth = pageWidth - leftMargin - rightMargin;
    let yPos = 20;
    const lineHeight = 7;

    // Add logo
    const logoUrl = "https://tools.unovacursos.com.br/public/images/logo-unova.png";
    try {
      const img = await fetch(logoUrl);
      const blob = await img.blob();
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onloadend = () => {
          doc.addImage(reader.result as string, "PNG", leftMargin, yPos, 40, 15);
          resolve(true);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error loading logo:", error);
    }
    yPos += 25;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE PAGAMENTO", pageWidth/2, yPos, { align: "center" });
    yPos += 15;

    // Amount
    doc.setFontSize(14);
    doc.text(data.amount, pageWidth/2, yPos, { align: "center" });
    yPos += 15;

    // Convert numeric value to words
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });

    // Main text with improved formatting and alignment
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Construct the first paragraph with better line breaks
    const firstParagraph = `Recebi(emos) de Escola Web Unova Cursos Ltda - CNPJ nº: 12.301.010/0001-46, a importância de ${valueInWords}`;
    
    // Calculate optimal line width for better text flow
    const maxWidth = textWidth - 5;
    const lines = doc.splitTextToSize(firstParagraph, maxWidth);
    
    // Render first paragraph with proper spacing
    lines.forEach((line: string) => {
      doc.text(line, leftMargin, yPos, { align: 'justify', maxWidth: maxWidth });
      yPos += lineHeight;
    });

    // Reference text with proper spacing
    yPos += 2; // Add small gap
    doc.text("referente ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.reference, leftMargin + doc.getTextWidth("referente "), yPos);
    yPos += lineHeight + 5;

    // Legal text
    doc.setFont("helvetica", "normal");
    const legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    const wrappedLegal = doc.splitTextToSize(legalText, textWidth);
    wrappedLegal.forEach((line: string) => {
      doc.text(line, leftMargin, yPos, { align: 'justify' });
      yPos += lineHeight;
    });
    yPos += 10;

    // Payee information
    doc.text("Pagamento recebido por: ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, leftMargin + doc.getTextWidth("Pagamento recebido por: "), yPos);
    yPos += lineHeight + 5;

    // PIX information
    doc.setFont("helvetica", "normal");
    doc.text("Chave PIX: ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(`${data.payee.pix_key} - Banco ${data.payee.bank_name}`, leftMargin + doc.getTextWidth("Chave PIX: "), yPos);
    yPos += lineHeight + 10;

    // Date and location
    doc.setFont("helvetica", "bold");
    doc.text("Goiânia", leftMargin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`, ${formatDate(data.date)}`, leftMargin + doc.getTextWidth("Goiânia"), yPos);
    yPos += 25;

    // Signature line
    doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, pageWidth/2, yPos + 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`CPF ${formatCPF(data.payee.cpf)}`, pageWidth/2, yPos + 20, { align: "center" });

    doc.save("recibo.pdf");
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

const formatCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};