import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as Icons from "lucide-react";
import type { Tool } from "@/hooks/useTools";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;

  const cardContent = (
    <Card className="group relative h-28 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 hover:border-primary/50">
      <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
        <div className="text-primary group-hover:scale-110 transition-transform">
          <IconComponent className="h-8 w-8" />
        </div>
        <span className="text-xs font-medium text-center line-clamp-2">
          {tool.name}
        </span>
      </CardContent>
    </Card>
  );

  const content = tool.external ? (
    <a href={tool.href} target="_blank" rel="noopener noreferrer">
      {cardContent}
    </a>
  ) : (
    <Link to={tool.href}>
      {cardContent}
    </Link>
  );

  if (tool.description) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{tool.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
