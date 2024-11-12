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
    // Validate required data
    if (!data.payee || !data.amount || !data.reference || !data.date) {
      console.error("Missing required data for PDF generation");
      return false;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 60; // 30px margin on each side
    
    // Create PDF without logo first
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RECIBO DE PAGAMENTO", 105, 30, { align: "center" });
    
    // Valor em destaque
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.amount, 105, 45, { align: "center" });
    
    // Converter valor numérico para extenso
    const numericValue = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Texto principal com quebras de linha apropriadas e margens ajustadas
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Primeiro parágrafo com quebra de linha automática
    const text = "Recebi(emos) de ";
    const companyName = "Escola Web Unova Cursos Ltda";
    const cnpj = " - CNPJ nº: 12.301.010/0001-46";
    const importanceText = ", a importância de ";

    let yPos = 65;
    const leftMargin = 30;

    // Primeiro parágrafo com quebra de linha automática
    let firstParagraph = text + companyName + cnpj + importanceText;
    let splitFirstParagraph = doc.splitTextToSize(firstParagraph, maxWidth);
    doc.text(splitFirstParagraph, leftMargin, yPos);
    yPos += (splitFirstParagraph.length * 7);

    // Valor por extenso e referência
    let valueAndReference = valueInWords + " referente " + data.reference;
    let splitValueAndReference = doc.splitTextToSize(valueAndReference, maxWidth);
    doc.text(splitValueAndReference, leftMargin, yPos);
    yPos += (splitValueAndReference.length * 7) + 10;

    // Segundo parágrafo com quebra de linha automática
    let secondParagraph = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena, rasa e irrevogável quitação, pelo valor recebido.";
    let splitSecondParagraph = doc.splitTextToSize(secondParagraph, maxWidth);
    doc.text(splitSecondParagraph, leftMargin, yPos);
    yPos += (splitSecondParagraph.length * 7) + 10;

    // Informações do beneficiário com quebra de linha
    doc.text("Pagamento recebido por: ", leftMargin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, leftMargin + doc.getTextWidth("Pagamento recebido por: "), yPos);
    yPos += 10;

    // Informações bancárias com quebra de linha
    let bankInfo = `Chave PIX: ${data.payee.pix_key} - Banco ${data.payee.bank_name}`;
    let splitBankInfo = doc.splitTextToSize(bankInfo, maxWidth);
    doc.setFont("helvetica", "normal");
    doc.text(splitBankInfo, leftMargin, yPos);
    yPos += (splitBankInfo.length * 7) + 10;

    // Data
    doc.text(`Goiânia, ${formatDate(data.date)}`, leftMargin, yPos);
    
    // Linha de assinatura e informações finais
    doc.line(leftMargin, yPos + 30, pageWidth - leftMargin, yPos + 30);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, 105, yPos + 40, { align: "center" });
    doc.setFont("helvetica", "normal");
    
    // Formatar CPF
    const formattedCPF = `CPF ${formatCPF(data.payee.cpf)}`;
    doc.text(formattedCPF, 105, yPos + 50, { align: "center" });
    
    // Download do PDF
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
  // Remove qualquer caractere não numérico
  const numbers = cpf.replace(/\D/g, '');
  
  // Aplica a máscara do CPF (000.000.000-00)
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};