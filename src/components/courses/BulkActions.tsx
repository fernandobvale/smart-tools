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
    if (!date) return;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    onMarkAsPaid(formattedDate);
    
    // Delay closing to ensure the action completes
    setTimeout(() => {
      setIsDatePickerOpen(false);
    }, 200);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="ml-2">Ações ({selectedIds.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Popover 
          open={isDatePickerOpen}
          onOpenChange={(open) => {
            if (open) {
              setIsDatePickerOpen(true);
            }
          }}
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
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Calendar
              mode="single"
              selected={new Date()}
              onSelect={handleDateSelect}
              disabled={false}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}