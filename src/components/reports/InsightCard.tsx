
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
}

export const InsightCard = ({ icon: Icon, title, description, action }: InsightCardProps) => {
  return (
    <Card className="h-full flex flex-col border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors duration-200 shadow-sm hover:shadow-md">
      <CardContent className="pt-6 flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-chariot-purple/10 rounded-md">
            <Icon className="h-5 w-5 text-chariot-purple" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" className="w-full justify-between hover:bg-chariot-purple/10 hover:text-chariot-purple">
          {action} <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
