import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentStatus = "Pendente" | "Pago" | "Cancelado";

interface CourseFiltersProps {
  editor: string;
  onEditorChange: (value: string) => void;
  paymentStatus: PaymentStatus | null;
  onPaymentStatusChange: (value: PaymentStatus | null) => void;
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
          value={paymentStatus ?? undefined}
          onValueChange={(value: PaymentStatus) => onPaymentStatusChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}