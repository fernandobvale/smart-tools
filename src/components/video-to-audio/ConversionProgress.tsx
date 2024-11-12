import { Progress } from "@/components/ui/progress";

interface ConversionProgressProps {
  progress: number;
}

export function ConversionProgress({ progress }: ConversionProgressProps) {
  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <p className="text-sm text-muted-foreground">
        Convertendo... {progress}%
      </p>
    </div>
  );
}