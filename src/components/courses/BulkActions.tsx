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
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      onMarkAsPaid(localDate.toISOString().split('T')[0]);
      setIsDatePickerOpen(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu 
      open={isDropdownOpen} 
      onOpenChange={(open) => {
        setIsDropdownOpen(open);
        if (!open) {
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
          onOpenChange={(open) => {
            setIsDatePickerOpen(open);
            if (!open) {
              setIsDropdownOpen(false);
            }
          }}
        >
          <PopoverTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsDatePickerOpen(true);
              }}
              onClick={(e) => {
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
            onInteractOutside={(e) => {
              e.preventDefault();
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