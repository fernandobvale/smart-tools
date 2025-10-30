import { useQuery } from "@tanstack/react-query";

interface UsdBrlData {
  USDBRL: {
    bid: string;
    ask: string;
    high: string;
    low: string;
  };
}

export const useUsdBrlRate = () => {
  return useQuery({
    queryKey: ["usd-brl-rate"],
    queryFn: async () => {
      const response = await fetch(
        "https://economia.awesomeapi.com.br/last/USD-BRL"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch USD/BRL rate");
      }
      const data: UsdBrlData = await response.json();
      return {
        rate: parseFloat(data.USDBRL.bid),
      };
    },
    refetchInterval: 60000, // Atualizar a cada 60 segundos
    staleTime: 30000, // Considerar dados frescos por 30 segundos
  });
};
