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

    // Add logo from URL
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
    
    // Amount highlight
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.amount, pageWidth/2, yPos, { align: "center" });
    yPos += 20;
    
    // Convert numeric value to words
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Main text with company info and amount
    doc.setFontSize(12);
    const companyInfo = "Escola Web Unova Cursos Ltda";
    const cnpj = "12.301.010/0001-46";

    // First paragraph with wrapped text
    let text = "Recebi(emos) de ";
    doc.setFont("helvetica", "normal");
    let xPos = leftMargin;
    let currentLine = "";
    let lineHeight = 7;

    // Write "Recebi(emos) de"
    doc.text(text, xPos, yPos);
    xPos += doc.getTextWidth(text);

    // Write company name in bold
    doc.setFont("helvetica", "bold");
    doc.text(companyInfo, xPos, yPos);
    xPos += doc.getTextWidth(companyInfo);

    // Write CNPJ info
    doc.setFont("helvetica", "normal");
    text = ` - CNPJ nº: ${cnpj}, a importância de `;
    if (xPos + doc.getTextWidth(text) > pageWidth - rightMargin) {
      yPos += lineHeight;
      xPos = leftMargin;
    }
    doc.text(text, xPos, yPos);

    // New line for value in words (in bold)
    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    const wrappedValue = doc.splitTextToSize(valueInWords, textWidth);
    doc.text(wrappedValue, leftMargin, yPos);
    yPos += wrappedValue.length * lineHeight;

    // Reference text
    doc.setFont("helvetica", "normal");
    text = "referente ";
    doc.text(text, leftMargin, yPos);
    xPos = leftMargin + doc.getTextWidth(text);

    // Reference in bold
    doc.setFont("helvetica", "bold");
    const wrappedReference = doc.splitTextToSize(data.reference, textWidth - doc.getTextWidth(text));
    doc.text(wrappedReference, xPos, yPos);
    yPos += wrappedReference.length * lineHeight + 10;

    // Legal text (normal font)
    doc.setFont("helvetica", "normal");
    const legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    const wrappedLegal = doc.splitTextToSize(legalText, textWidth);
    doc.text(wrappedLegal, leftMargin, yPos);
    yPos += wrappedLegal.length * lineHeight + 15;

    // Payee information
    doc.text("Pagamento recebido por: ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, leftMargin + doc.getTextWidth("Pagamento recebido por: "), yPos);
    yPos += 10;

    // PIX information with specific parts in bold
    xPos = leftMargin;
    doc.setFont("helvetica", "normal");
    doc.text("Chave ", xPos, yPos);
    xPos += doc.getTextWidth("Chave ");

    doc.setFont("helvetica", "bold");
    doc.text("PIX", xPos, yPos);
    xPos += doc.getTextWidth("PIX");

    doc.setFont("helvetica", "normal");
    doc.text(": ", xPos, yPos);
    xPos += doc.getTextWidth(": ");

    doc.setFont("helvetica", "bold");
    doc.text(data.payee.pix_key, xPos, yPos);
    xPos += doc.getTextWidth(data.payee.pix_key);

    doc.setFont("helvetica", "normal");
    doc.text(" - ", xPos, yPos);
    xPos += doc.getTextWidth(" - ");

    doc.setFont("helvetica", "bold");
    doc.text(`Banco ${data.payee.bank_name}`, xPos, yPos);
    yPos += 15;

    // Date with bold city name
    doc.setFont("helvetica", "bold");
    doc.text("Goiânia", leftMargin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`, ${formatDate(data.date)}`, leftMargin + doc.getTextWidth("Goiânia"), yPos);
    yPos += 25;

    // Signature line and final information
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