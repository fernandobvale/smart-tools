import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bitcoin, ExternalLink } from "lucide-react";
import { formatCurrency, formatCurrencyUSD } from "@/lib/utils";
import { useBitcoinPrice } from "@/hooks/useBitcoinPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  const isPositiveBrl = (data?.change24hBrl ?? 0) >= 0;
  const isPositiveUsd = (data?.change24hUsd ?? 0) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="w-5 h-5 text-[#F7931A]" />
          Cotação Bitcoin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">BTC/BRL</div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(data?.priceBrl ?? 0)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositiveBrl ? "text-green-600" : "text-red-600"}`}>
              {isPositiveBrl ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositiveBrl ? "+" : ""}{data?.change24hBrl.toFixed(2)}% (24h)
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm text-muted-foreground mb-1">BTC/USD</div>
            <div className="text-2xl font-bold mb-2">
              {formatCurrencyUSD(data?.priceUsd ?? 0)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositiveUsd ? "text-green-600" : "text-red-600"}`}>
              {isPositiveUsd ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositiveUsd ? "+" : ""}{data?.change24hUsd.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Button
          variant="secondary"
          className="w-full"
          asChild
        >
          <a 
            href="https://www.alfredp2p.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Comprar P2P
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
