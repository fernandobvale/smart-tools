import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface BulkActionsProps {
  selectedIds: string[];
  onMarkAsPaid: (date: string) => void;
}

export function BulkActions({ selectedIds, onMarkAsPaid }: BulkActionsProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onMarkAsPaid(formattedDate);
      // Aguarda a conclusão da ação antes de fechar
      setTimeout(() => {
        setIsDatePickerOpen(false);
      }, 100);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="ml-2">Ações ({selectedIds.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        onCloseAutoFocus={(e) => {
          if (isDatePickerOpen) {
            e.preventDefault();
          }
        }}
      >
        <Popover 
          open={isDatePickerOpen} 
          onOpenChange={(open) => {
            // Só permite fechar se não estiver selecionando uma data
            if (!open) {
              setIsDatePickerOpen(false);
            } else {
              setIsDatePickerOpen(true);
            }
          }}
          modal={false}
        >
          <PopoverTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsDatePickerOpen(true);
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Marcar como pago
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            onPointerDownOutside={(e) => {
              // Previne o fechamento ao clicar dentro do calendário
              if (isDatePickerOpen) {
                e.preventDefault();
              }
            }}
            onInteractOutside={(e) => {
              // Previne o fechamento ao interagir com o calendário
              if (isDatePickerOpen) {
                e.preventDefault();
              }
            }}
          >
            <Calendar
              mode="single"
              selected={new Date()}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}