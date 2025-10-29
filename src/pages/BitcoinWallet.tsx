import { WalletSummary } from "@/components/bitcoin/WalletSummary";
import { BitcoinPriceCard } from "@/components/bitcoin/BitcoinPriceCard";
import { TransactionForm } from "@/components/bitcoin/TransactionForm";
import { TransactionTable } from "@/components/bitcoin/TransactionTable";

const BitcoinWallet = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Carteira Bitcoin</h1>
        <p className="text-muted-foreground">
          Acompanhe seus investimentos em Bitcoin e visualize seus ganhos ou perdas em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletSummary />
        <BitcoinPriceCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm />
        </div>
        <div className="lg:col-span-2">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

export default BitcoinWallet;
