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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format the date directly without timezone adjustments
      const formattedDate = format(date, 'yyyy-MM-dd');
      onMarkAsPaid(formattedDate);
      setIsDatePickerOpen(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu 
      open={isDropdownOpen} 
      onOpenChange={(open) => {
        setIsDropdownOpen(open);
        if (!open && !isDatePickerOpen) {
          setIsDatePickerOpen(false);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="ml-2">Ações ({selectedIds.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Popover 
          open={isDatePickerOpen} 
          onOpenChange={setIsDatePickerOpen}
        >
          <PopoverTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
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