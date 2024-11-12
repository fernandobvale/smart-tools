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

    const results = splitText(inputText, charLimit);
    setSplitResults(results);
    toast.success(`Texto dividido em ${results.length} partes`);
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    toast.success(`Parte ${index + 1} copiada para a área de transferência`);
  };

  const handleClear = () => {
    setInputText("");
    setSplitResults([]);
    toast.success("Tudo limpo!");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Divisor de Texto</h1>
          <p className="text-muted-foreground">
            Divida seu texto em partes menores preservando frases completas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
          <Button onClick={handleSplit} className="w-full sm:w-auto">
            Dividir Texto
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Limpar Tudo
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Digite seu texto
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole seu texto aqui..."
            className="min-h-[200px] bg-background text-foreground dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        {splitResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Resultados
            </h2>
            <div className="grid gap-6">
              {splitResults.map((result, index) => (
                <div
                  key={index}
                  className="relative bg-background border border-input rounded-lg p-4 dark:bg-gray-900"
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
                    className="min-h-[100px] bg-background text-foreground dark:bg-gray-900 dark:text-gray-100"
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