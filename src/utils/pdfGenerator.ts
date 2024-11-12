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
    
    const text = "Recebi(emos) de ";
    const companyName = "Escola Web Unova Cursos Ltda";
    const cnpj = " - CNPJ nº: 12.301.010/0001-46";
    const importanceText = ", a importância de ";

    let xPos = 30; // Aumentada a margem esquerda
    const yPos = 65;

    doc.text(text, xPos, yPos);
    xPos += doc.getTextWidth(text);
    
    doc.setFont("helvetica", "bold");
    doc.text(companyName, xPos, yPos);
    xPos += doc.getTextWidth(companyName);
    
    doc.setFont("helvetica", "normal");
    doc.text(cnpj + importanceText, xPos, yPos);
    
    // Valor por extenso em negrito com margem ajustada
    doc.setFont("helvetica", "bold");
    doc.text(valueInWords, 30, 75);
    
    // Referência com margem ajustada
    doc.setFont("helvetica", "normal");
    doc.text(" referente ", 30 + doc.getTextWidth(valueInWords), 75);
    
    // Referência em negrito
    doc.setFont("helvetica", "bold");
    doc.text(data.reference, 30 + doc.getTextWidth(valueInWords + " referente "), 75);
    
    // Segundo parágrafo com margem ajustada
    doc.setFont("helvetica", "normal");
    doc.text("Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos,", 30, 95);
    doc.text("dando plena, rasa e irrevogável quitação, pelo valor recebido.", 30, 105);
    
    // Informações do beneficiário com margem ajustada
    doc.text("Pagamento recebido por: ", 30, 125);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, 30 + doc.getTextWidth("Pagamento recebido por: "), 125);
    
    doc.setFont("helvetica", "normal");
    doc.text("Chave PIX: ", 30, 135);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.pix_key, 30 + doc.getTextWidth("Chave PIX: "), 135);
    
    doc.setFont("helvetica", "normal");
    doc.text(" - Banco ", 30 + doc.getTextWidth("Chave PIX: " + data.payee.pix_key), 135);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.bank_name, 30 + doc.getTextWidth("Chave PIX: " + data.payee.pix_key + " - Banco "), 135);
    
    // Data com margem ajustada
    doc.setFont("helvetica", "normal");
    doc.text(`Goiânia, ${formatDate(data.date)}`, 30, 155);
    
    // Linha de assinatura
    doc.line(30, 185, 180, 185);
    doc.setFont("helvetica", "bold");
    doc.text(data.payee.full_name, 105, 195, { align: "center" });
    doc.setFont("helvetica", "normal");
    
    // Formatar CPF
    const formattedCPF = `CPF ${formatCPF(data.payee.cpf)}`;
    doc.text(formattedCPF, 105, 205, { align: "center" });
    
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