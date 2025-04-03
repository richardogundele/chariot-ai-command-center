
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertButtonProps {
  label: string;
  variant: "default" | "outline" | "ghost";
  icon: LucideIcon | null;
}

interface AlertProps {
  icon: LucideIcon;
  title: string;
  description: string;
  urgency: "urgent" | "warning" | "opportunity";
  timestamp: string;
  buttons: AlertButtonProps[];
}

export const Alert = ({ icon: Icon, title, description, urgency, timestamp, buttons }: AlertProps) => {
  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-md border",
      urgency === "urgent" ? "bg-red-500/5 border-red-500/20" :
      urgency === "warning" ? "bg-yellow-500/5 border-yellow-500/20" :
      "bg-green-500/5 border-green-500/20"
    )}>
      <div className={cn(
        "p-2 rounded-full",
        urgency === "urgent" ? "bg-red-500/10" :
        urgency === "warning" ? "bg-yellow-500/10" :
        "bg-green-500/10"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          urgency === "urgent" ? "text-red-500" :
          urgency === "warning" ? "text-yellow-500" :
          "text-green-500"
        )} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {buttons.map((btn, index) => (
            <Button 
              key={index}
              size="sm" 
              variant={btn.variant} 
              className="h-7 text-xs"
            >
              {btn.icon && <btn.icon className="h-3 w-3 mr-1" />}
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
