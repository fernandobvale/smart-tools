
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  description: string;
  link?: string;
}

export function InfoTooltip({ description, link }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <span className="ml-1 align-middle cursor-pointer text-muted-foreground hover:text-primary">
            <Info size={17} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-left">
          <span>{description}</span>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-xs text-violet-700 underline"
            >
              Ir para o painel
            </a>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
