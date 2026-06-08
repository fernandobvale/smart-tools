import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, MapPin } from "lucide-react";

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const CepConsulta = () => {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CepData | null>(null);
  const [history, setHistory] = useState<CepData[]>([]);
  const { toast } = useToast();

  const handleConsulta = async () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      toast({ variant: "destructive", title: "CEP inválido", description: "Digite os 8 dígitos do CEP." });
      return;
    }

    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      if (!res.ok) throw new Error("Falha na consulta");
      const json: CepData = await res.json();
      if (json.erro) {
        toast({ variant: "destructive", title: "CEP não encontrado", description: "Verifique o número e tente novamente." });
        return;
      }
      setData(json);
      setHistory((prev) => [json, ...prev.filter((h) => h.cep !== json.cep)].slice(0, 10));
      toast({ title: "CEP encontrado", description: `${json.logradouro || "Logradouro"} - ${json.localidade}/${json.uf}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (d: CepData) => {
    const text = [d.logradouro, d.complemento, d.bairro, `${d.localidade}/${d.uf}`, d.cep]
      .filter(Boolean)
      .join(", ");
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Endereço copiado para a área de transferência." });
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Consulta de CEP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="00000-000"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleConsulta()}
              maxLength={9}
              className="flex-1"
            />
            <Button onClick={handleConsulta} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                "Consultar"
              )}
            </Button>
          </div>

          {data && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                <p><span className="text-muted-foreground">CEP:</span> <span className="font-semibold">{data.cep}</span></p>
                <p><span className="text-muted-foreground">Logradouro:</span> <span className="font-semibold">{data.logradouro || "—"}</span></p>
                <p><span className="text-muted-foreground">Bairro:</span> <span className="font-semibold">{data.bairro || "—"}</span></p>
                <p><span className="text-muted-foreground">Cidade:</span> <span className="font-semibold">{data.localidade}</span></p>
                <p><span className="text-muted-foreground">Estado:</span> <span className="font-semibold">{data.uf}</span></p>
                {data.complemento && (
                  <p><span className="text-muted-foreground">Complemento:</span> <span className="font-semibold">{data.complemento}</span></p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleCopy(data)} className="mt-2">
                <Copy className="mr-2 h-4 w-4" />
                Copiar endereço
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-bold">Histórico da sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((h) => (
              <div key={h.cep} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <div>
                  <p className="font-semibold">{h.cep}</p>
                  <p className="text-muted-foreground">
                    {[h.logradouro, h.bairro, `${h.localidade}/${h.uf}`].filter(Boolean).join(" - ")}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(h)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CepConsulta;
