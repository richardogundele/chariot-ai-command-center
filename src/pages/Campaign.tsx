
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

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Campaign;
