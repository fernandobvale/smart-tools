import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "./types";
import { useState } from "react";

interface DateFieldProps {
  form?: UseFormReturn<CourseFormValues>;
  name: string;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (date: string) => void;
}

export function DateField({ form, name, label, required, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  if (form) {
    return (
      <FormField
        control={form.control}
        name={name as "data_entrega" | "data_pagamento"}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(parseISO(field.value), "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? parseISO(field.value) : required ? new Date() : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const localDate = new Date(date.getTime());
                      field.onChange(localDate.toISOString().split('T')[0]);
                      setOpen(false); // Close the popover after selection
                    } else {
                      field.onChange("");
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? (
              format(parseISO(value), "dd/MM/yyyy")
            ) : (
              <span>Selecione uma data</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? parseISO(value) : undefined}
            onSelect={(date) => {
              if (date && onChange) {
                const localDate = new Date(date.getTime());
                onChange(localDate.toISOString().split('T')[0]);
                setOpen(false); // Close the popover after selection
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}