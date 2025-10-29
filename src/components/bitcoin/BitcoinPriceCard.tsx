import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bitcoin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useBitcoinPrice } from "@/hooks/useBitcoinPrice";
import { Skeleton } from "@/components/ui/skeleton";

export const BitcoinPriceCard = () => {
  const { data, isLoading } = useBitcoinPrice();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="w-5 h-5" />
            Cotação Bitcoin (BTC/BRL)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-6 w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = (data?.change24h ?? 0) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="w-5 h-5 text-[#F7931A]" />
          Cotação Bitcoin (BTC/BRL)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {formatCurrency(data?.price ?? 0)}
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? "+" : ""}{data?.change24h.toFixed(2)}% (24h)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
