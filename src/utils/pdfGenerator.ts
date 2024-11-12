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
    yPos += 20;
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE PAGAMENTO", pageWidth/2, yPos, { align: "center" });
    yPos += 10;
    
    // Amount highlight
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.amount, pageWidth/2, yPos, { align: "center" });
    yPos += 15;
    
    // Convert numeric value to words
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Main paragraph with company info and amount
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const companyInfo = "Escola Web Unova Cursos Ltda";
    const cnpj = "12.301.010/0001-46";
    const firstParagraph = `Recebi(emos) de ${companyInfo} - CNPJ nº: ${cnpj}, a importância de `;
    
    const splitFirstParagraph = doc.splitTextToSize(firstParagraph, textWidth);
    doc.text(splitFirstParagraph, leftMargin, yPos, { align: "justify", maxWidth: textWidth });
    yPos += (splitFirstParagraph.length * 7);

    // Value in words (bold)
    doc.setFont("helvetica", "bold");
    doc.text(valueInWords, leftMargin, yPos);
    const valueInWordsWidth = doc.getTextWidth(valueInWords);
    yPos += 7;

    // Reference text
    doc.setFont("helvetica", "normal");
    const referenceText = ` referente ${data.reference}.`;
    doc.text(referenceText, leftMargin, yPos);
    yPos += 10;

    // Legal text with proper splitting and justification
    doc.setFont("helvetica", "bold");
    const legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    const splitLegalText = doc.splitTextToSize(legalText, textWidth);
    doc.text(splitLegalText, leftMargin, yPos, { align: "justify", maxWidth: textWidth });
    yPos += (splitLegalText.length * 7) + 10;

    // Payee information
    doc.setFont("helvetica", "bold");
    doc.text("Pagamento recebido por:", leftMargin, yPos);
    const receivedByWidth = doc.getTextWidth("Pagamento recebido por: ");
    doc.text(data.payee.full_name, leftMargin + receivedByWidth, yPos);
    yPos += 7;

    // Bank information
    doc.setFont("helvetica", "normal");
    const bankInfo = `Chave PIX: ${data.payee.pix_key} - Banco ${data.payee.bank_name}`;
    const splitBankInfo = doc.splitTextToSize(bankInfo, textWidth);
    doc.text(splitBankInfo, leftMargin, yPos);
    yPos += (splitBankInfo.length * 7) + 10;

    // Date with bold city name
    doc.setFont("helvetica", "bold");
    doc.text("Goiânia", leftMargin, yPos);
    const cityWidth = doc.getTextWidth("Goiânia");
    doc.setFont("helvetica", "normal");
    doc.text(`, ${formatDate(data.date)}`, leftMargin + cityWidth, yPos);
    yPos += 20;

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