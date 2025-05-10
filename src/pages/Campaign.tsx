
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import CampaignDialog from "@/components/products/CampaignDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "@/components/campaign/CampaignList";
import { CampaignDetails } from "@/components/campaign/CampaignDetails";
import { CampaignPerformanceTabs } from "@/components/campaign/CampaignPerformanceTabs";
import { CampaignSummaryCards } from "@/components/campaign/CampaignSummaryCards";
import { CampaignRealTimeMetrics } from "@/components/campaign/CampaignRealTimeMetrics";
import { CampaignActions } from "@/components/campaign/CampaignActions";
import { toast } from "sonner";
import { getCampaignStatus, getFacebookCampaignAnalytics } from "@/services/platforms/facebookService";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Campaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<string>("Draft");
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Extract campaignId from state (if available)
  useEffect(() => {
    if (location.state?.campaignId) {
      setCampaignId(location.state.campaignId);
      if (location.state.status) {
        setCampaignStatus(location.state.status);
      }
      
      // Clear state after using it
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Load campaign data when campaignId changes
  useEffect(() => {
    if (campaignId) {
      const loadCampaignData = async () => {
        setLoading(true);
        try {
          // Fetch campaign details
          const { data, error } = await supabase
            .from('campaigns')
            .select(`
              *,
              products:product_id (
                id,
                name,
                description,
                image,
                ad_copy
              )
            `)
            .eq('id', campaignId)
            .single();
            
          if (error) throw error;
          
          setCampaignData(data);
          setCampaignStatus(data.status);
          
          // Fetch campaign analytics if active
          if (data.status === 'Active' || data.status === 'Paused') {
            const analyticsData = await getFacebookCampaignAnalytics(campaignId);
            if (analyticsData.success) {
              setAnalytics(analyticsData);
            }
          }
          
        } catch (error) {
          console.error("Error loading campaign data:", error);
          toast.error("Failed to load campaign data");
        } finally {
          setLoading(false);
        }
      };
      
      loadCampaignData();
      
      // Set up polling for campaign status updates if pending
      if (campaignStatus === 'Pending') {
        const statusInterval = setInterval(async () => {
          try {
            const statusResult = await getCampaignStatus(campaignId);
            if (statusResult.status && statusResult.status !== campaignStatus) {
              setCampaignStatus(statusResult.status);
              
              if (statusResult.status === 'Active') {
                toast.success("Campaign is now active");
                clearInterval(statusInterval);
              } else if (statusResult.status === 'Failed') {
                toast.error("Campaign setup failed");
                clearInterval(statusInterval);
              }
            }
          } catch (error) {
            console.error("Error polling campaign status:", error);
          }
        }, 3000);
        
        return () => clearInterval(statusInterval);
      }
    }
  }, [campaignId, campaignStatus]);
  
  const handleStatusChange = (newStatus: string) => {
    setCampaignStatus(newStatus);
  };

  const handleCreateCampaign = () => {
    setOpenDialog(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (campaignId && campaignData) {
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Button variant="ghost" onClick={() => setCampaignId(null)} className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Button>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold">{campaignData.name}</h2>
                <Badge>{campaignData.platform}</Badge>
              </div>
            </div>
            
            <div>
              <CampaignActions 
                campaignId={campaignId} 
                status={campaignStatus}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
          
          {(campaignStatus === 'Active' || campaignStatus === 'Paused') && (
            <>
              <CampaignSummaryCards 
                impressions={analytics?.impressions || 0}
                clicks={analytics?.clicks || 0}
                ctr={analytics?.ctr || 0}
                spend={analytics?.spend || 0}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CampaignRealTimeMetrics campaignId={campaignId} />
                </div>
                <div>
                  <CampaignDetails 
                    campaign={campaignData} 
                    product={campaignData.products} 
                  />
                </div>
              </div>
              
              <CampaignPerformanceTabs 
                campaignId={campaignId}
                conversions={analytics?.conversions || 0}
                cpa={analytics?.cpa || 0}
                roas={analytics?.roas || 0}
              />
            </>
          )}
        </div>
      );
    }
    
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage your marketing campaigns
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
            <CampaignList filter="all" onSelectCampaign={setCampaignId} />
          </TabsContent>
          <TabsContent value="active">
            <CampaignList filter="Active" onSelectCampaign={setCampaignId} />
          </TabsContent>
          <TabsContent value="paused">
            <CampaignList filter="Paused" onSelectCampaign={setCampaignId} />
          </TabsContent>
          <TabsContent value="completed">
            <CampaignList filter="Completed" onSelectCampaign={setCampaignId} />
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <DashboardLayout>
      {renderContent()}
      
      <CampaignDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
        onCampaignCreated={() => {
          // Refresh the campaign list after creating a new campaign
          // Implementation depends on your data fetching strategy
        }}
      />
    </DashboardLayout>
  );
};

export default Campaign;
