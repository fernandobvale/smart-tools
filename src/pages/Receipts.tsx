import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayeeList from "@/components/receipts/PayeeList";
import PayeeForm from "@/components/receipts/PayeeForm";

const Receipts = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Geração de Recibos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
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