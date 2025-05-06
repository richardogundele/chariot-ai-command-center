
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, CalendarDays } from "lucide-react";
import CampaignDialog from "@/components/products/CampaignDialog";
import { CampaignSummaryCards } from "@/components/campaign/CampaignSummaryCards";
import { CampaignList } from "@/components/campaign/CampaignList";
import { CampaignPerformanceTabs } from "@/components/campaign/CampaignPerformanceTabs";

const Campaign = () => {
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">Manage and track all your product campaigns</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Last 7 days
          </Button>
          <Button className="gap-2" onClick={() => setCampaignDialogOpen(true)}>
            <Play className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      {/* Campaign Summary Cards */}
      <CampaignSummaryCards />
      
      {/* List of Campaigns */}
      <CampaignList />
      
      {/* Performance Charts */}
      <CampaignPerformanceTabs />
      
      <CampaignDialog 
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Campaign;
