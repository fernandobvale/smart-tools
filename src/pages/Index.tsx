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
      toast.error("Please enter some text to split");
      return;
    }

    if (charLimit < 100) {
      toast.error("Character limit must be at least 100");
      return;
    }

    const results = splitText(inputText, charLimit);
    setSplitResults(results);
    toast.success(`Text split into ${results.length} parts`);
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    toast.success(`Part ${index + 1} copied to clipboard`);
  };

  const handleClear = () => {
    setInputText("");
    setSplitResults([]);
    toast.success("All cleared!");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Text Splitter</h1>
          <p className="text-muted-foreground">
            Split your text into smaller chunks while preserving complete sentences
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-48">
            <Input
              type="number"
              value={charLimit}
              onChange={(e) => setCharLimit(Number(e.target.value))}
              min={100}
              className="w-full"
              placeholder="Character limit"
            />
          </div>
          <Button onClick={handleSplit} className="w-full sm:w-auto">
            Split Text
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Clear All
          </Button>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Enter your text
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="min-h-[200px] bg-editor-bg border-editor-border"
          />
        </div>

        {/* Results */}
        {splitResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Split Results
            </h2>
            <div className="grid gap-6">
              {splitResults.map((result, index) => (
                <div
                  key={index}
                  className="relative bg-editor-bg border border-editor-border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Part {index + 1} ({result.length} characters)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result, index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[100px] bg-white"
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