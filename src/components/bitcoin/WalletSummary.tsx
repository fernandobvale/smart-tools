import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useBitcoinTransactions } from "@/hooks/useBitcoinTransactions";
import { useBitcoinPrice } from "@/hooks/useBitcoinPrice";
import { Skeleton } from "@/components/ui/skeleton";

export const WalletSummary = () => {
  const { transactions, isLoading: isLoadingTransactions } = useBitcoinTransactions();
  const { data: priceData, isLoading: isLoadingPrice } = useBitcoinPrice();

  if (isLoadingTransactions || isLoadingPrice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Resumo da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalInvested = transactions
    .filter(t => t.transaction_type === "compra")
    .reduce((sum, t) => sum + Number(t.amount_brl), 0);

  const totalBtc = transactions
    .filter(t => t.transaction_type === "compra")
    .reduce((sum, t) => sum + Number(t.amount_btc), 0);

  const currentValue = totalBtc * (priceData?.price ?? 0);
  const profit = currentValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
  const averagePrice = totalBtc > 0 ? totalInvested / totalBtc : 0;
  const isProfit = profit >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Resumo da Carteira
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Investido:</span>
          <span className="font-semibold">{formatCurrency(totalInvested)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Bitcoin:</span>
          <span className="font-semibold">{totalBtc.toFixed(8)} BTC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Valor Atual:</span>
          <span className="font-semibold">{formatCurrency(currentValue)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Preço Médio:</span>
          <span className="font-semibold">{formatCurrency(averagePrice)}/BTC</span>
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              {isProfit ? "Lucro:" : "Perda:"}
            </span>
            <div className="text-right">
              <div className={`font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(Math.abs(profit))}
              </div>
              <div className={`text-sm ${isProfit ? "text-green-600" : "text-red-600"}`}>
                ({isProfit ? "+" : ""}{profitPercentage.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
