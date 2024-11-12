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
    const lineHeight = 6; // Reduced line height

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
    
    // Title - Centered and bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE PAGAMENTO", pageWidth/2, yPos, { align: "center" });
    yPos += 15;
    
    // Amount - Centered and bold
    doc.setFontSize(14);
    doc.text(data.amount, pageWidth/2, yPos, { align: "center" });
    yPos += 15;
    
    // Convert numeric value to words
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Main text with company info and amount
    doc.setFontSize(11);
    let text = "Recebi(emos) de ";
    let xPos = leftMargin;

    // Write initial text
    doc.setFont("helvetica", "normal");
    doc.text(text, xPos, yPos);
    xPos += doc.getTextWidth(text);

    // Write company name in bold
    doc.setFont("helvetica", "bold");
    const companyName = "Escola Web Unova Cursos Ltda";
    doc.text(companyName, xPos, yPos);
    xPos += doc.getTextWidth(companyName);

    // Write CNPJ info
    doc.setFont("helvetica", "normal");
    text = ` - CNPJ nº: 12.301.010/0001-46, a importância de `;
    doc.text(text, xPos, yPos);
    yPos += lineHeight;

    // Value in words (bold)
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
    doc.text(data.reference, xPos, yPos);
    yPos += lineHeight + 5;

    // Legal text (normal font, justified)
    doc.setFont("helvetica", "normal");
    const legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    const wrappedLegal = doc.splitTextToSize(legalText, textWidth);
    doc.text(wrappedLegal, leftMargin, yPos);
    yPos += wrappedLegal.length * lineHeight + 10;

    // Payee information
    doc.text("Pagamento recebido por: ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, leftMargin + doc.getTextWidth("Pagamento recebido por: "), yPos);
    yPos += lineHeight + 5;

    // PIX information
    doc.setFont("helvetica", "normal");
    doc.text("Chave ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text("PIX", leftMargin + doc.getTextWidth("Chave "), yPos);
    doc.setFont("helvetica", "normal");
    doc.text(": ", leftMargin + doc.getTextWidth("Chave PIX"), yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.pix_key, leftMargin + doc.getTextWidth("Chave PIX: "), yPos);
    doc.setFont("helvetica", "normal");
    doc.text(" - ", leftMargin + doc.getTextWidth("Chave PIX: " + data.payee.pix_key), yPos);
    doc.setFont("helvetica", "bold");
    doc.text(`Banco ${data.payee.bank_name}`, leftMargin + doc.getTextWidth("Chave PIX: " + data.payee.pix_key + " - "), yPos);
    yPos += lineHeight + 10;

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