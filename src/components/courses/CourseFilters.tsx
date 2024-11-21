import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseFiltersProps {
  editor: string;
  onEditorChange: (value: string) => void;
  paymentStatus: string | null;
  onPaymentStatusChange: (value: string | null) => void;
}

export function CourseFilters({
  editor,
  onEditorChange,
  paymentStatus,
  onPaymentStatusChange,
}: CourseFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Filtrar por editor..."
          value={editor}
          onChange={(e) => onEditorChange(e.target.value)}
        />
      </div>
      <div className="w-[200px]">
        <Select
          value={paymentStatus || ""}
          onValueChange={(value) => onPaymentStatusChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="Sim">Pago</SelectItem>
            <SelectItem value="Não">Não Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}