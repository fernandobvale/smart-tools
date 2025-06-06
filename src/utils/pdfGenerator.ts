
import { jsPDF } from "jspdf";
import extenso from "extenso";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseCurrencyToNumber } from "./currencyUtils";

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
      console.error("Dados incompletos para geração do PDF:", data);
      throw new Error("Dados incompletos para geração do PDF");
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const leftMargin = 20;
    const rightMargin = 20;
    const textWidth = pageWidth - leftMargin - rightMargin;
    let yPos = 20;

    // Add logo from URL
    try {
      const logoUrl = "https://tools.unovacursos.com.br/public/images/logo-unova.png";
      const img = await fetch(logoUrl);
      const blob = await img.blob();
      const reader = new FileReader();
      
      await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          try {
            doc.addImage(reader.result as string, "PNG", leftMargin, yPos, 40, 15);
            resolve(true);
          } catch (error) {
            console.error("Erro ao adicionar imagem:", error);
            resolve(true); // Continue mesmo se a imagem falhar
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao carregar logo:", error);
      // Continua sem o logo se houver erro
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
    
    try {
      // Convert numeric value to words using the proper currency utility
      console.log("Converting amount to number:", data.amount);
      const numericValue = parseCurrencyToNumber(data.amount);
      
      if (numericValue === 0 || isNaN(numericValue)) {
        console.error("Valor inválido após conversão:", numericValue);
        throw new Error("Valor inválido para conversão");
      }
      
      console.log("Numeric value after conversion:", numericValue);
      const valueInWords = extenso(numericValue, { mode: 'currency' });
      console.log("Value in words:", valueInWords);
      
      // Main paragraph with company info and amount
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const companyInfo = "Escola Web Unova Cursos Ltda";
      const cnpj = "12.301.010/0001-46";
      const firstParagraph = `Recebi(emos) de ${companyInfo} - CNPJ nº: ${cnpj}, a importância de ${valueInWords} referente ${data.reference}.`;
      
      const splitFirstParagraph = doc.splitTextToSize(firstParagraph, textWidth);
      doc.text(splitFirstParagraph, leftMargin, yPos, { align: "justify", maxWidth: textWidth });
      yPos += (splitFirstParagraph.length * 7) + 10;

      // Legal text
      doc.setFont("helvetica", "bold");
      const legalText = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
      const splitLegalText = doc.splitTextToSize(legalText, textWidth);
      doc.text(splitLegalText, leftMargin, yPos, { align: "justify", maxWidth: textWidth });
      yPos += (splitLegalText.length * 7) + 15;

      // Payee information
      doc.setFont("helvetica", "bold");
      doc.text("Pagamento recebido por:", leftMargin, yPos);
      const receivedByWidth = doc.getTextWidth("Pagamento recebido por: ");
      doc.text(data.payee.full_name, leftMargin + receivedByWidth, yPos);
      yPos += 10;

      // Bank information
      doc.setFont("helvetica", "normal");
      const bankInfo = `Chave PIX: ${data.payee.pix_key} - Banco ${data.payee.bank_name}`;
      const splitBankInfo = doc.splitTextToSize(bankInfo, textWidth);
      doc.text(splitBankInfo, leftMargin, yPos);
      yPos += (splitBankInfo.length * 7) + 15;

      // Format the date correctly using date-fns with local timezone
      const formattedDate = format(parseISO(data.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

      // Date with bold city name
      doc.setFont("helvetica", "bold");
      doc.text("Goiânia", leftMargin, yPos);
      const cityWidth = doc.getTextWidth("Goiânia");
      doc.setFont("helvetica", "normal");
      doc.text(`, ${formattedDate}`, leftMargin + cityWidth, yPos);
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
      console.error("Erro durante a geração do PDF:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
};

const formatCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
