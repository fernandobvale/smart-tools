export const parseCurrencyToNumber = (currencyString: string): number => {
  // Remove o símbolo da moeda e espaços
  const cleanValue = currencyString.replace(/R\$\s?/g, '');
  
  // Remove todos os pontos de separação de milhares
  const withoutThousandSeparator = cleanValue.replace(/\./g, '');
  
  // Substitui a vírgula por ponto para decimal
  const withDecimalPoint = withoutThousandSeparator.replace(',', '.');
  
  // Converte para número
  return parseFloat(withDecimalPoint);
};

export const formatNumberToCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};