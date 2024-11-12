import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayeeList from "@/components/receipts/PayeeList";
import PayeeForm from "@/components/receipts/PayeeForm";

const Receipts = () => {
  return (
    <div className="container mx-auto p-2 sm:p-4">
      <Card className="w-full">
        <CardHeader className="text-center sm:text-left p-4 pt-8 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Sistema de Geração de Recibos</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="lista">Lista de Beneficiários</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastrar Novo</TabsTrigger>
            </TabsList>
            <TabsContent value="lista">
              <PayeeList />
            </TabsContent>
            <TabsContent value="cadastro">
              <PayeeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipts;