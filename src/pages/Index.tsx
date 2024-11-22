import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { splitText } from "@/lib/textSplitter";
import { Copy } from "lucide-react";

const Index = () => {
  const [charLimit, setCharLimit] = useState<number>(800);
  const [inputText, setInputText] = useState<string>("");
  const [splitResults, setSplitResults] = useState<string[]>([]);

  const handleSplit = () => {
    if (!inputText.trim()) {
      toast.error("Por favor, insira algum texto para dividir");
      return;
    }

    if (charLimit < 100) {
      toast.error("O limite de caracteres deve ser pelo menos 100");
      return;
    }

    try {
      const results = splitText(inputText, charLimit);
      setSplitResults(results);
      toast.success(`Texto dividido em ${results.length} partes`);
    } catch (error) {
      toast.error("Erro ao dividir o texto. Por favor, tente novamente.");
      console.error("Error splitting text:", error);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Parte ${index + 1} copiada para a área de transferência`);
    } catch (error) {
      toast.error("Erro ao copiar o texto. Por favor, tente novamente.");
      console.error("Error copying text:", error);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSplitResults([]);
    toast.success("Tudo limpo!");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold">Divisor de Texto</h1>
          <p className="text-muted-foreground">
            Divida seu texto em partes menores preservando frases completas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Input
              type="number"
              value={charLimit}
              onChange={(e) => setCharLimit(Number(e.target.value))}
              min={100}
              className="w-full"
              placeholder="Limite de caracteres"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={handleSplit} className="flex-1 sm:flex-none">
              Dividir Texto
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Limpar Tudo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Digite seu texto</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole seu texto aqui..."
            className="min-h-[200px]"
          />
        </div>

        {splitResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Resultados</h2>
            <div className="grid gap-6">
              {splitResults.map((result, index) => (
                <div
                  key={`result-${index}`}
                  className="bg-card border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Parte {index + 1} ({result.length} caracteres)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result, index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;