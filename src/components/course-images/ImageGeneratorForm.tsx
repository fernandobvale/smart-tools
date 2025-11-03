import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface ImageGeneratorFormProps {
  onGenerate: (courseName: string) => void;
  isLoading: boolean;
}

export function ImageGeneratorForm({ onGenerate, isLoading }: ImageGeneratorFormProps) {
  const [courseName, setCourseName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName.trim()) {
      onGenerate(courseName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseName">Nome do Curso</Label>
        <Input
          id="courseName"
          placeholder="Ex: Curso de Fotografia Digital"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!courseName.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando Prompts...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar Prompts com IA
          </>
        )}
      </Button>
    </form>
  );
}
