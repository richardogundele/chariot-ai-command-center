
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
      "flex items-start gap-4 p-4 rounded-md border backdrop-blur-sm transition-all duration-200 hover:shadow-md",
      urgency === "high" ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40" :
      urgency === "medium" ? "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40" :
      "bg-chariot-purple/5 border-chariot-purple/20 hover:border-chariot-purple/40"
    )}>
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 mt-0.5",
        urgency === "high" ? "text-red-500" :
        urgency === "medium" ? "text-yellow-500" :
        "text-chariot-purple"
      )} />
      
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        
        <div className="flex gap-2">
          <Button size="sm" className={cn(
            "h-7 text-xs",
            urgency === "high" ? "bg-red-500 hover:bg-red-600" :
            urgency === "medium" ? "bg-yellow-500 hover:bg-yellow-600" :
            "bg-chariot-purple hover:bg-chariot-indigo"
          )}>View Details</Button>
          <Button size="sm" variant="outline" className={cn(
            "h-7 text-xs border",
            urgency === "high" ? "border-red-500/20 hover:bg-red-500/10" :
            urgency === "medium" ? "border-yellow-500/20 hover:bg-yellow-500/10" :
            "border-chariot-purple/20 hover:bg-chariot-purple/10"
          )}>Dismiss</Button>
        </div>
      </div>
    </div>
  );
};
