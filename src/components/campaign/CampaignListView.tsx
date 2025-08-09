import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "@/components/campaign/CampaignList";
import { BulkCampaignActions } from "@/components/campaign/BulkCampaignActions";
import { CampaignFilters } from "@/components/campaign/CampaignFilters";
import { CampaignTemplates } from "@/components/campaign/CampaignTemplates";
import { PerformanceAlerts } from "@/components/campaign/PerformanceAlerts";
import CampaignDialog from "@/components/products/CampaignDialog";
import { Plus, Filter, File, Bell } from "lucide-react";

interface CampaignListViewProps {
  onSelectCampaign: (campaignId: string) => void;
}

interface CampaignFilters {
  search: string;
  status: string;
  platform: string;
  dateRange: string;
  budgetRange: string;
}

export const CampaignListView = ({ onSelectCampaign }: CampaignListViewProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [filters, setFilters] = useState<CampaignFilters>({
    search: '',
    status: 'all',
    platform: 'all',
    dateRange: 'all',
    budgetRange: 'all'
  });

  useEffect(() => {
    const open = () => setOpenDialog(true);
    window.addEventListener('open-campaign-dialog', open);
    return () => window.removeEventListener('open-campaign-dialog', open);
  }, []);

  const handleCreateCampaign = () => {
    setOpenDialog(true);
  };

  const handleFiltersChange = (newFilters: CampaignFilters) => {
    setFilters(newFilters);
  };

  const handleBulkAction = (action: string, campaignIds: string[]) => {
    console.log(`Executing ${action} on campaigns:`, campaignIds);
    // Implementation would go here
  };

  const handleTemplateSelect = (template: any) => {
    console.log('Template selected:', template);
    // This would pre-fill the campaign creation form
    setOpenDialog(true);
  };

  const handleTemplateSave = (template: any) => {
    console.log('Template saved:', template);
    // This would save the template to the database
  };

  // Mock campaigns data for bulk actions
  const mockCampaigns = [
    { id: '1', name: 'Summer Sale', status: 'Active', platform: 'Facebook' },
    { id: '2', name: 'Product Launch', status: 'Paused', platform: 'Instagram' },
    { id: '3', name: 'Holiday Promo', status: 'Active', platform: 'Facebook' }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your Facebook marketing campaigns with advanced tools
          </p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">
            <File className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="mr-2 h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CampaignFilters onFiltersChange={handleFiltersChange} />
            </div>
            <div className="lg:col-span-3">
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <CampaignTemplates 
            onTemplateSelect={handleTemplateSelect}
            onTemplateSave={handleTemplateSave}
          />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkCampaignActions 
            campaigns={mockCampaigns}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <PerformanceAlerts />
        </TabsContent>
      </Tabs>

      <CampaignDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
        onCampaignCreated={() => {
          // Refresh the campaign list after creating a new campaign
        }}
      />
    </>
  );
};
