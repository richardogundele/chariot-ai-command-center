
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, change, changeType, icon: Icon }: MetricCardProps) => {
  return (
    <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors duration-200 shadow-sm hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <Icon className="h-4 w-4 text-chariot-purple" />
        </div>
        
        <div className="text-2xl font-bold mb-2">{value}</div>
        
        <div className="flex items-center gap-1">
          <div className={cn(
            "flex items-center text-xs font-medium",
            changeType === "increase" ? "text-green-600" : "text-red-600"
          )}>
            {changeType === "increase" ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {change}%
          </div>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
};
