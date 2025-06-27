
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Trash2, Copy, Settings } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  status: string;
  platform: string;
}

interface BulkCampaignActionsProps {
  campaigns: Campaign[];
  onBulkAction: (action: string, campaignIds: string[]) => void;
}

export const BulkCampaignActions = ({ campaigns, onBulkAction }: BulkCampaignActionsProps) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(campaigns.map(c => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const executeBulkAction = () => {
    if (selectedCampaigns.length === 0) {
      toast.error("Please select at least one campaign");
      return;
    }

    if (!bulkAction) {
      toast.error("Please select an action to perform");
      return;
    }

    onBulkAction(bulkAction, selectedCampaigns);
    
    const actionNames = {
      'start': 'started',
      'pause': 'paused',
      'delete': 'deleted',
      'clone': 'cloned'
    };

    toast.success(`${selectedCampaigns.length} campaigns ${actionNames[bulkAction as keyof typeof actionNames] || 'updated'}`);
    setSelectedCampaigns([]);
    setBulkAction("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Bulk Actions
        </CardTitle>
        <CardDescription>Perform actions on multiple campaigns at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All ({campaigns.length} campaigns)
          </label>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-2">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center space-x-2 p-2 border rounded">
              <Checkbox
                id={campaign.id}
                checked={selectedCampaigns.includes(campaign.id)}
                onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{campaign.name}</p>
                <p className="text-xs text-muted-foreground">{campaign.platform} • {campaign.status}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedCampaigns.length > 0 && (
          <div className="space-y-3">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Campaigns
                  </div>
                </SelectItem>
                <SelectItem value="pause">
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4" />
                    Pause Campaigns
                  </div>
                </SelectItem>
                <SelectItem value="clone">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Clone Campaigns
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Campaigns
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={executeBulkAction} className="w-full">
              Apply to {selectedCampaigns.length} Campaign{selectedCampaigns.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
