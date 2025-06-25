
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignDetails } from "@/components/campaign/CampaignDetails";
import { CampaignPerformanceTabs } from "@/components/campaign/CampaignPerformanceTabs";
import { CampaignSummaryCards } from "@/components/campaign/CampaignSummaryCards";
import { CampaignRealTimeMetrics } from "@/components/campaign/CampaignRealTimeMetrics";
import { CampaignActions } from "@/components/campaign/CampaignActions";
import { toast } from "sonner";
import { getCampaignStatus, getFacebookCampaignAnalytics } from "@/services/platforms/facebook";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CampaignDetailViewProps {
  campaignId: string;
  onBackToList: () => void;
}

export const CampaignDetailView = ({ campaignId, onBackToList }: CampaignDetailViewProps) => {
  const [loading, setLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [campaignStatus, setCampaignStatus] = useState<string>("Draft");
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Load campaign data when campaignId changes
  useEffect(() => {
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
  }, [campaignId, campaignStatus]);
  
  const handleStatusChange = (newStatus: string) => {
    setCampaignStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!campaignData) {
    return (
      <div className="text-center py-8">
        <p>Campaign not found</p>
        <Button onClick={onBackToList} className="mt-4">
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" onClick={onBackToList} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">{campaignData.name}</h2>
            <Badge variant="outline" className="text-sm">
              {campaignData.platform}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Campaign Actions - Always show for active campaigns */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <CampaignActions 
          campaignId={campaignId} 
          status={campaignStatus}
          onStatusChange={handleStatusChange}
        />
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
};
