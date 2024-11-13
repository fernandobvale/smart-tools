export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
};

export const validateCPF = (cpf: string) => {
  const cleanCpf = cpf.replace(/\D/g, "");
  return cleanCpf.length === 11;
};