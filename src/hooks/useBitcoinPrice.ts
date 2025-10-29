import { useQuery } from "@tanstack/react-query";

interface BitcoinPriceData {
  bitcoin: {
    brl: number;
    brl_24h_change: number;
  };
}

export const useBitcoinPrice = () => {
  return useQuery({
    queryKey: ["bitcoin-price"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl&include_24hr_change=true"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Bitcoin price");
      }
      const data: BitcoinPriceData = await response.json();
      return {
        price: data.bitcoin.brl,
        change24h: data.bitcoin.brl_24h_change,
      };
    },
    refetchInterval: 60000, // Atualizar a cada 60 segundos
    staleTime: 30000, // Considerar dados frescos por 30 segundos
  });
};
