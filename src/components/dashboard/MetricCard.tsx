
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
    <Card className="border border-border hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 bg-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="text-2xl font-bold text-card-foreground mb-2">{value}</div>
        
        <div className="flex items-center gap-1">
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            changeType === "increase" 
              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30" 
              : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
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
