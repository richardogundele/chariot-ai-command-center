
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "@/components/campaign/CampaignList";
import CampaignDialog from "@/components/products/CampaignDialog";
import { Plus } from "lucide-react";

interface CampaignListViewProps {
  onSelectCampaign: (campaignId: string) => void;
}

export const CampaignListView = ({ onSelectCampaign }: CampaignListViewProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateCampaign = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your Facebook marketing campaigns
          </p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CampaignList filter="all" onSelectCampaign={onSelectCampaign} />
        </TabsContent>
        <TabsContent value="active">
          <CampaignList filter="Active" onSelectCampaign={onSelectCampaign} />
        </TabsContent>
        <TabsContent value="paused">
          <CampaignList filter="Paused" onSelectCampaign={onSelectCampaign} />
        </TabsContent>
        <TabsContent value="completed">
          <CampaignList filter="Completed" onSelectCampaign={onSelectCampaign} />
        </TabsContent>
      </Tabs>

      <CampaignDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
        onCampaignCreated={() => {
          // Refresh the campaign list after creating a new campaign
          // Implementation depends on your data fetching strategy
        }}
      />
    </>
  );
};
