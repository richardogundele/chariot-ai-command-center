
import { Progress } from "@/components/ui/progress";

export const BudgetTracker = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">Facebook</div>
          <div>$1,245.80</div>
        </div>
        <Progress value={38} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">Instagram</div>
          <div>$985.25</div>
        </div>
        <Progress value={30} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">Google</div>
          <div>$1,014.45</div>
        </div>
        <Progress value={32} className="h-2" />
      </div>
      
      <div className="pt-3 mt-1 border-t border-border">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Total Spend</div>
          <div className="text-sm font-medium">$3,245.50</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">42% of monthly budget</div>
      </div>
    </div>
  );
};
