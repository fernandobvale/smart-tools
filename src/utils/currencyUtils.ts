export const parseCurrencyToNumber = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove currency symbol, spaces and dots (thousand separators)
  const cleanValue = currencyString
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(/\s/g, '');
  
  // Replace comma with dot for decimal
  const withDecimalPoint = cleanValue.replace(',', '.');
  
  // Convert to number and ensure it's a valid number
  const number = parseFloat(withDecimalPoint);
  
  // Add debug logs
  console.log('Original value:', currencyString);
  console.log('Cleaned value:', cleanValue);
  console.log('With decimal point:', withDecimalPoint);
  console.log('Final number:', number);
  
  return isNaN(number) ? 0 : number;
};

export const formatNumberToCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};