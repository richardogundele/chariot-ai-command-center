import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Play, Pause, Settings, BarChart3, Users, 
  Calendar, AlertTriangle, RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CampaignRealTimeMetrics } from './CampaignRealTimeMetrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: string;
  name: string;
  status: string;
  platform: string;
  budget: number;
  product_id: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  ad_copy: string;
}

export interface CampaignDetailsProps {
  campaign: any;
  product: any;
}

export const CampaignDetails = ({ campaign, product }: CampaignDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-muted-foreground">Platform</dt>
            <dd className="font-medium">{campaign?.platform || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Daily Budget</dt>
            <dd className="font-medium">${campaign?.budget || '0'}/day</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Product</dt>
            <dd className="font-medium">{product?.name || 'N/A'}</dd>
          </div>
          
          {product && product.ad_copy && (
            <div>
              <dt className="text-sm text-muted-foreground">Ad Copy</dt>
              <dd className="mt-1 text-sm border rounded-md p-3 max-h-32 overflow-y-auto">
                {product.ad_copy}
              </dd>
            </div>
          )}
          
          {product && product.image && (
            <div>
              <dt className="text-sm text-muted-foreground">Ad Image</dt>
              <dd className="mt-1">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-32 object-cover rounded-md" 
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

// Keep the default export for direct route usage
const CampaignDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (campaignError) throw campaignError;
        
        if (!campaignData) {
          toast({
            title: "Campaign not found",
            description: "The campaign you're looking for doesn't exist",
            variant: "destructive"
          });
          navigate('/campaign');
          return;
        }
        
        setCampaign(campaignData);
        
        // Fetch associated product
        if (campaignData.product_id) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id, name, description, image, ad_copy')
            .eq('id', campaignData.product_id)
            .maybeSingle();
            
          if (!productError && productData) {
            setProduct(productData);
          }
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [id, navigate, toast]);
  
  const handleToggleStatus = async () => {
    if (!campaign) return;
    
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaign.id);
        
      if (error) throw error;
      
      setCampaign({
        ...campaign,
        status: newStatus
      });
      
      toast({
        title: `Campaign ${newStatus}`,
        description: `The campaign has been ${newStatus === 'Active' ? 'activated' : 'paused'} successfully`,
      });
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate('/campaign')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{campaign?.name || 'Campaign Details'}</h1>
          <div className="flex items-center gap-2 mt-1">
            {campaign?.status && (
              <Badge 
                variant="outline"
                className={`
                  ${campaign.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                    campaign.status === 'Paused' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 
                    'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                `}
              >
                {campaign.status}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {campaign ? `Created on ${new Date(campaign.created_at).toLocaleDateString()}` : 'Loading...'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={campaign?.status === 'Active' ? 'outline' : 'default'}
            onClick={handleToggleStatus}
            disabled={loading}
          >
            {campaign?.status === 'Active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <CampaignRealTimeMetrics campaignId={id || ''} />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Platform</dt>
                  <dd className="font-medium">{campaign?.platform || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Daily Budget</dt>
                  <dd className="font-medium">${campaign?.budget || '0'}/day</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Product</dt>
                  <dd className="font-medium">{product?.name || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {product && (
            <Card>
              <CardHeader>
                <CardTitle>Ad Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Ad Image</div>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={product.image || '/placeholder.svg'} 
                      alt={product.name} 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Ad Copy</div>
                  <div className="border rounded-md p-3 text-sm max-h-40 overflow-y-auto">
                    {product.ad_copy || 'No ad copy available'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="audience">
            <Users className="h-4 w-4 mr-2" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Issues
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Campaign Performance Analysis</h3>
          <p className="text-muted-foreground">Detailed performance metrics for your campaign</p>
          
          {/* This would be populated with more detailed performance metrics */}
          <div className="h-64 border rounded-md bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>Detailed performance analysis would appear here</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="audience" className="mt-6">
          <h3 className="text-lg font-medium">Audience Insights</h3>
          <p className="text-muted-foreground">Demographic and behavioral data about your audience</p>
          
          <div className="h-64 border rounded-md bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>Audience insights would appear here</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <h3 className="text-lg font-medium">Campaign Schedule</h3>
          <p className="text-muted-foreground">Set up and manage campaign timing</p>
          
          <div className="h-64 border rounded-md bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>Campaign schedule would appear here</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="issues" className="mt-6">
          <h3 className="text-lg font-medium">Campaign Issues</h3>
          <p className="text-muted-foreground">Potential problems or performance issues with your campaign</p>
          
          <div className="h-64 border rounded-md bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No issues detected with this campaign</p>
              <p className="text-sm text-muted-foreground">We'll let you know if anything needs attention</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CampaignDetailsPage;
