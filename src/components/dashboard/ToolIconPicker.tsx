import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolIconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Lista de ícones mais comuns/úteis
const commonIcons = [
  "FileText", "Calculator", "Search", "Globe", "Edit3", "StickyNote",
  "Award", "Users", "Lightbulb", "List", "GraduationCap", "MessageSquare",
  "Database", "BarChart3", "AlertTriangle", "BookOpen", "BookPlus", "Bitcoin",
  "Image", "Settings", "Home", "Mail", "Phone", "Calendar", "Clock",
  "User", "Package", "ShoppingCart", "Heart", "Star", "Bookmark",
  "Camera", "Video", "Music", "File", "Folder", "Download", "Upload",
  "Lock", "Unlock", "Key", "Shield", "Eye", "EyeOff", "Bell",
  "Zap", "TrendingUp", "Target", "Activity", "PieChart", "DollarSign"
];

export function ToolIconPicker({ value, onValueChange }: ToolIconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span>{value}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ícone..." />
          <CommandList>
            <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
            <CommandGroup>
              {commonIcons.map((iconName) => {
                const IconComponent = (Icons as any)[iconName];
                return (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={() => {
                      onValueChange(iconName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === iconName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <IconComponent className="mr-2 h-4 w-4" />
                    {iconName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
