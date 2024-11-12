import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Payee {
  id: string;
  full_name: string;
  cpf: string;
  pix_key: string;
  bank_name: string;
}

const PayeeList = () => {
  const navigate = useNavigate();

  const { data: payees, isLoading } = useQuery({
    queryKey: ["payees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payees")
        .select("*")
        .order("full_name");

      if (error) throw error;
      return data as Payee[];
    },
  });

  if (isLoading) {
    return <div>Carregando beneficiários...</div>;
  }

  return (
    <div className="space-y-4">
      {payees?.map((payee) => (
        <div
          key={payee.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div>
            <h3 className="font-medium">{payee.full_name}</h3>
            <p className="text-sm text-gray-500">CPF: {payee.cpf}</p>
          </div>
          <Button
            onClick={() => navigate(`/receipts/new/${payee.id}`)}
            variant="outline"
          >
            Gerar Recibo
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PayeeList;