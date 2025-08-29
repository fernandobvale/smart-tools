
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CourseSuggestion } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SuggestionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: CourseSuggestion | null;
}

export const SuggestionDetailsModal = ({
  open,
  onOpenChange,
  suggestion,
}: SuggestionDetailsModalProps) => {
  if (!suggestion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Sugestão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data da Sugestão</h4>
              <p className="text-sm">
                {format(new Date(suggestion.suggestion_date), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Curso Criado?</h4>
              <Badge variant={suggestion.course_created ? "default" : "secondary"}>
                {suggestion.course_created ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Curso Sugerido</h4>
            <p className="text-sm">{suggestion.suggested_course}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Escola</h4>
              <p className="text-sm">{suggestion.school}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Atendente Responsável</h4>
              <p className="text-sm">{suggestion.attendant}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Buscas na Internet</h4>
            <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{suggestion.internet_searches}</p>
          </div>

          {suggestion.observations && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Observações</h4>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{suggestion.observations}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
