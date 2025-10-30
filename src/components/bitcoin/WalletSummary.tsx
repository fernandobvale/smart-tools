import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatCurrencyUSD } from "@/lib/utils";
import { useBitcoinTransactions } from "@/hooks/useBitcoinTransactions";
import { useBitcoinPrice } from "@/hooks/useBitcoinPrice";
import { useUsdBrlRate } from "@/hooks/useUsdBrlRate";
import { Skeleton } from "@/components/ui/skeleton";

export const WalletSummary = () => {
  const { transactions, isLoading: isLoadingTransactions } = useBitcoinTransactions();
  const { data: priceData, isLoading: isLoadingPrice } = useBitcoinPrice();
  const { data: usdBrlData, isLoading: isLoadingUsdBrl } = useUsdBrlRate();

  if (isLoadingTransactions || isLoadingPrice || isLoadingUsdBrl) {
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

  const usdBrlRate = usdBrlData?.rate ?? 1;
  
  const currentValueBrl = totalBtc * (priceData?.priceBrl ?? 0);
  const currentValueUsd = currentValueBrl / usdBrlRate;
  
  const profitBrl = currentValueBrl - totalInvested;
  const profitUsd = profitBrl / usdBrlRate;
  
  const profitPercentage = totalInvested > 0 ? (profitBrl / totalInvested) * 100 : 0;
  const averagePriceBrl = totalBtc > 0 ? totalInvested / totalBtc : 0;
  const averagePriceUsd = averagePriceBrl / usdBrlRate;
  const isProfit = profitBrl >= 0;
  
  const totalInvestedUsd = totalInvested / usdBrlRate;

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
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(totalInvested)}</div>
            <div className="text-sm text-muted-foreground">{formatCurrencyUSD(totalInvestedUsd)}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Bitcoin:</span>
          <span className="font-semibold">{totalBtc.toFixed(8)} BTC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Valor Atual:</span>
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(currentValueBrl)}</div>
            <div className="text-sm text-muted-foreground">{formatCurrencyUSD(currentValueUsd)}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Preço Médio:</span>
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(averagePriceBrl)}/BTC</div>
            <div className="text-sm text-muted-foreground">{formatCurrencyUSD(averagePriceUsd)}/BTC</div>
          </div>
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
                {formatCurrency(Math.abs(profitBrl))}
              </div>
              <div className={`text-sm ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {formatCurrencyUSD(Math.abs(profitUsd))}
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
