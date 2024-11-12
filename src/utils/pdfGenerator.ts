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
    const maxWidth = pageWidth - 60; // 30px margin on each side
    const leftMargin = 30;
    let yPos = 30;
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE PAGAMENTO", pageWidth/2, yPos, { align: "center" });
    yPos += 15;
    
    // Amount highlight
    doc.setFontSize(14);
    doc.text(data.amount, pageWidth/2, yPos, { align: "center" });
    yPos += 20;
    
    // Convert numeric value to words
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Main text with proper line breaks and formatting
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const text = "Recebi(emos) de ";
    const companyName = "Escola Web Unova Cursos Ltda";
    const cnpj = " - CNPJ nº: 12.301.010/0001-46";
    const importanceText = ", a importância de ";

    // First paragraph with automatic line breaks
    doc.setFont("helvetica", "normal");
    let firstParagraph = text + companyName + cnpj + importanceText;
    let splitFirstParagraph = doc.splitTextToSize(firstParagraph, maxWidth);
    doc.text(splitFirstParagraph, leftMargin, yPos);
    yPos += (splitFirstParagraph.length * 7);

    // Value in words and reference
    let valueAndReference = valueInWords + " referente " + data.reference + ".";
    let splitValueAndReference = doc.splitTextToSize(valueAndReference, maxWidth);
    doc.text(splitValueAndReference, leftMargin, yPos);
    yPos += (splitValueAndReference.length * 7) + 10;

    // Legal text
    let legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    let splitLegalText = doc.splitTextToSize(legalText, maxWidth);
    doc.text(splitLegalText, leftMargin, yPos);
    yPos += (splitLegalText.length * 7) + 10;

    // Payee information
    doc.setFont("helvetica", "bold");
    doc.text("Pagamento recebido por:", leftMargin, yPos);
    const receivedByWidth = doc.getTextWidth("Pagamento recebido por: ");
    doc.text(data.payee.full_name, leftMargin + receivedByWidth, yPos);
    yPos += 10;

    // Bank information
    doc.setFont("helvetica", "normal");
    let bankInfo = `Chave PIX: ${data.payee.pix_key} - Banco ${data.payee.bank_name}`;
    let splitBankInfo = doc.splitTextToSize(bankInfo, maxWidth);
    doc.text(splitBankInfo, leftMargin, yPos);
    yPos += (splitBankInfo.length * 7) + 10;

    // Date
    doc.text(`Goiânia, ${formatDate(data.date)}`, leftMargin, yPos);
    yPos += 30;

    // Signature line and final information
    doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
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