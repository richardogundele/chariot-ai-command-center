
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const CampaignStatus = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Campaign Status</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">About Campaign Status</h4>
                <p className="text-sm text-muted-foreground">
                  This shows the current activity of the AI campaign manager.
                  Activities change as the AI optimizes your campaign in real-time.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription>Live AI campaign activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 mt-1.5 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium">Optimizing ad creatives</p>
              <p className="text-xs text-muted-foreground">Testing variations to improve engagement</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mt-1.5"></div>
            <div>
              <p className="text-sm font-medium">Budget reallocation</p>
              <p className="text-xs text-muted-foreground">Moving funds to high-performing channels</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-3 w-3 rounded-full bg-blue-500 mt-1.5"></div>
            <div>
              <p className="text-sm font-medium">Audience analysis</p>
              <p className="text-xs text-muted-foreground">Identifying top-converting segments</p>
            </div>
          </div>
          
          <div className="pt-3 mt-3 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm">Next update in:</div>
              <div className="text-sm font-medium">12 minutes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
