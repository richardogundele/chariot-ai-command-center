
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CampaignListView } from "@/components/campaign/CampaignListView";
import { CampaignDetailView } from "@/components/campaign/CampaignDetailView";
import { useCampaignNavigation } from "@/hooks/useCampaignNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Campaign = () => {
  const { campaignId, selectCampaign, backToList } = useCampaignNavigation();

  const renderContent = () => {
    if (campaignId) {
      return (
        <CampaignDetailView 
          campaignId={campaignId} 
          onBackToList={backToList}
        />
      );
    }
    
    return <CampaignListView onSelectCampaign={selectCampaign} />;
  };

  const headerActions = !campaignId ? (
    <Button onClick={() => window.dispatchEvent(new Event('open-campaign-dialog'))} size="sm" className="font-medium">
      <Plus className="h-4 w-4 mr-2" />
      New Campaign
    </Button>
  ) : null;

  return (
    <DashboardLayout headerActions={headerActions}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Campaign;
