
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
}

export const AlertCard = ({ icon: Icon, title, description, urgency }: AlertCardProps) => {
  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-md border",
      urgency === "high" ? "bg-red-500/5 border-red-500/20" :
      urgency === "medium" ? "bg-yellow-500/5 border-yellow-500/20" :
      "bg-blue-500/5 border-blue-500/20"
    )}>
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 mt-0.5",
        urgency === "high" ? "text-red-500" :
        urgency === "medium" ? "text-yellow-500" :
        "text-blue-500"
      )} />
      
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        
        <div className="flex gap-2">
          <Button size="sm" className="h-7 text-xs">View Details</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">Dismiss</Button>
        </div>
      </div>
    </div>
  );
};
