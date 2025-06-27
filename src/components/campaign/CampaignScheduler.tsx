
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

interface CampaignSchedulerProps {
  campaignId: string;
  onScheduleUpdate: (schedule: CampaignSchedule) => void;
}

interface CampaignSchedule {
  startDate?: string;
  endDate?: string;
  isScheduled: boolean;
  autoStart: boolean;
  autoEnd: boolean;
}

export const CampaignScheduler = ({ campaignId, onScheduleUpdate }: CampaignSchedulerProps) => {
  const [schedule, setSchedule] = useState<CampaignSchedule>({
    isScheduled: false,
    autoStart: false,
    autoEnd: false
  });

  const handleScheduleChange = (updates: Partial<CampaignSchedule>) => {
    const newSchedule = { ...schedule, ...updates };
    setSchedule(newSchedule);
    onScheduleUpdate(newSchedule);
  };

  const saveSchedule = () => {
    if (schedule.isScheduled && (!schedule.startDate || !schedule.endDate)) {
      toast.error("Please set both start and end dates for scheduled campaigns");
      return;
    }
    
    toast.success("Campaign schedule updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Campaign Scheduling
        </CardTitle>
        <CardDescription>Set automatic start and end times for your campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="scheduled">Enable Scheduling</Label>
            <p className="text-sm text-muted-foreground">Automatically start and stop campaign</p>
          </div>
          <Switch
            id="scheduled"
            checked={schedule.isScheduled}
            onCheckedChange={(checked) => handleScheduleChange({ isScheduled: checked })}
          />
        </div>

        {schedule.isScheduled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={schedule.startDate || ''}
                  onChange={(e) => handleScheduleChange({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={schedule.endDate || ''}
                  onChange={(e) => handleScheduleChange({ endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoStart">Auto-start Campaign</Label>
                  <p className="text-sm text-muted-foreground">Automatically activate campaign at start time</p>
                </div>
                <Switch
                  id="autoStart"
                  checked={schedule.autoStart}
                  onCheckedChange={(checked) => handleScheduleChange({ autoStart: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoEnd">Auto-end Campaign</Label>
                  <p className="text-sm text-muted-foreground">Automatically pause campaign at end time</p>
                </div>
                <Switch
                  id="autoEnd"
                  checked={schedule.autoEnd}
                  onCheckedChange={(checked) => handleScheduleChange({ autoEnd: checked })}
                />
              </div>
            </div>

            <Button onClick={saveSchedule} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Save Schedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
