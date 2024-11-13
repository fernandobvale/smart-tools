import React from "react";
import { Input } from "@/components/ui/input";

interface CpfInputProps {
  cpf: string;
  onChange: (value: string) => void;
}

const CpfInput = ({ cpf, onChange }: CpfInputProps) => {
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    onChange(formattedCpf.slice(0, 14));
  };

  return (
    <Input
      placeholder="Digite o CPF"
      value={cpf}
      onChange={handleChange}
      maxLength={14}
      className="flex-1"
    />
  );
};

export default CpfInput;