
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  product_id: string;
  status: string;
  budget: number;
  platform: string;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
    description: string;
    image: string;
    ad_copy: string;
  };
  performance?: {
    roas: string;
    ctr: string;
    conversions: number;
    spend: string;
  };
}

interface CampaignListProps {
  filter: string;
  onSelectCampaign: (campaignId: string) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({ filter, onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          throw new Error("User not authenticated");
        }

        let query = supabase
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
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false });
        
        if (filter !== 'all') {
          query = query.eq('status', filter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setCampaigns(data || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Could not load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [filter]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {filter === 'all' ? 'All Campaigns' : 
             `${filter} Campaigns`}
          </CardTitle>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <CardDescription>
          {loading ? "Loading campaigns..." : 
           campaigns.length > 0 ? `Showing ${campaigns.length} campaigns` : 
           "No campaigns found"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 rounded-lg border animate-pulse h-32">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <div 
                key={campaign.id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectCampaign(campaign.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Product: {campaign.products ? campaign.products.name : 'Unknown'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    campaign.status === "Active" ? "bg-green-500/10 text-green-600" :
                    campaign.status === "Paused" ? "bg-yellow-500/10 text-yellow-600" :
                    campaign.status === "Stopped" ? "bg-red-500/10 text-red-600" :
                    campaign.status === "Pending" ? "bg-blue-500/10 text-blue-600" :
                    "bg-gray-500/10 text-gray-600"
                  }`}>
                    {campaign.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Budget</div>
                    <div className="text-sm font-medium">${campaign.budget}/day</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Platform</div>
                    <div className="text-sm font-medium">{campaign.platform}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Created</div>
                    <div className="text-sm font-medium">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
                    <div className="text-sm font-medium">
                      {new Date(campaign.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="default" 
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No campaigns found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {filter !== 'all' ? 
                `Try changing your filter or create a new campaign with status "${filter}"` : 
                "Create a new campaign to get started"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
