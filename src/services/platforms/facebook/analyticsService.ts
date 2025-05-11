
import { supabase } from "@/integrations/supabase/client";
import { CampaignMetaData, FacebookCampaignAnalytics } from './types';
import { makeMetaApiCall } from './apiClient';
import { getUserAccessToken } from './auth';

// Function to get Facebook ad campaign analytics
export async function getFacebookCampaignAnalytics(campaignId: string): Promise<FacebookCampaignAnalytics> {
  try {
    // Check if campaign exists and belongs to the user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, status, meta_data')
      .eq('id', campaignId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (campaignError) {
      console.error("Error fetching campaign:", campaignError);
      return { success: false, error: "Campaign not found" };
    }
    
    if (!campaignData) {
      return { success: false, error: "Campaign not found" };
    }
    
    const accessToken = await getUserAccessToken();
    
    if (!accessToken) {
      return { success: false, error: "Facebook access token not found" };
    }
    
    // If we have a real Facebook campaign ID
    const metaData = campaignData.meta_data as CampaignMetaData | null;
    if (metaData && metaData.campaign_id) {
      const metaCampaignId = metaData.campaign_id;
      
      // Get insights from Facebook API
      const insights = await makeMetaApiCall(`/${metaCampaignId}/insights`, 'GET', {
        fields: 'impressions,clicks,ctr,spend,actions,action_values',
        time_range: JSON.stringify({
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          until: new Date().toISOString().split('T')[0]
        })
      }, accessToken);
      
      if (!insights.data || !insights.data[0]) {
        // No data yet, return zeros
        return {
          success: true,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          spend: 0,
          conversions: 0,
          cpa: 0,
          roas: 0
        };
      }
      
      const insightData = insights.data[0];
      
      // Find conversion actions
      let conversions = 0;
      let revenue = 0;
      
      if (insightData.actions) {
        for (const action of insightData.actions) {
          if (['purchase', 'offsite_conversion'].includes(action.action_type)) {
            conversions += parseInt(action.value || '0');
          }
        }
      }
      
      if (insightData.action_values) {
        for (const actionValue of insightData.action_values) {
          if (['purchase', 'offsite_conversion'].includes(actionValue.action_type)) {
            revenue += parseFloat(actionValue.value || '0');
          }
        }
      }
      
      // Calculate metrics
      const impressions = parseInt(insightData.impressions || '0');
      const clicks = parseInt(insightData.clicks || '0');
      const ctr = parseFloat(insightData.ctr || '0') * 100; // Convert to percentage
      const spend = parseFloat(insightData.spend || '0');
      
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;
      
      return {
        success: true,
        impressions,
        clicks,
        ctr,
        spend,
        conversions,
        cpa,
        roas
      };
    } else {
      // If we don't have a real Facebook campaign ID or it's in testing,
      // generate simulated data based on campaign status
      const impressions = Math.floor(Math.random() * 10000) + 1000;
      const clicks = Math.floor(Math.random() * 500) + 50;
      const spend = Math.floor(Math.random() * 100) + 10;
      const conversions = Math.floor(Math.random() * 20) + 1;
      
      const ctr = (clicks / impressions) * 100;
      const cpa = spend / (conversions || 1);
      const revenue = conversions * (Math.floor(Math.random() * 50) + 20);
      const roas = revenue / spend;
      
      return {
        success: true,
        impressions,
        clicks,
        ctr,
        spend,
        conversions,
        cpa,
        roas
      };
    }
  } catch (error: any) {
    console.error('Error fetching Facebook campaign analytics:', error);
    return { 
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

// Function to get campaign status
export async function getCampaignStatus(campaignId: string): Promise<{
  status?: string;
  lastUpdated?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('status, updated_at, meta_data')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error("Error fetching campaign status:", error);
      return { error: "Campaign not found" };
    }
    
    if (!data) {
      return { error: "Campaign not found" };
    }
    
    // If the campaign has a meta_campaign_id, check its status on Facebook
    const metaData = data.meta_data as CampaignMetaData | null;
    if (metaData && metaData.campaign_id && 
        (data.status === 'Active' || data.status === 'Paused')) {
      try {
        const accessToken = await getUserAccessToken();
        if (accessToken) {
          const fbCampaign = await makeMetaApiCall(
            `/${metaData.campaign_id}`, 
            'GET', 
            { fields: 'status,effective_status' },
            accessToken
          );
          
          // Map Facebook status to our status
          if (fbCampaign.effective_status) {
            let mappedStatus = data.status;
            
            if (['ACTIVE', 'CAMPAIGN_PAUSED', 'PAUSED'].includes(fbCampaign.effective_status)) {
              mappedStatus = fbCampaign.effective_status === 'ACTIVE' ? 'Active' : 'Paused';
              
              // Update our database if status changed
              if (mappedStatus !== data.status) {
                await supabase
                  .from('campaigns')
                  .update({ status: mappedStatus })
                  .eq('id', campaignId);
              }
            }
            
            return {
              status: mappedStatus,
              lastUpdated: data.updated_at
            };
          }
        }
      } catch (fbError) {
        console.error("Error checking Facebook campaign status:", fbError);
        // If the API call fails, just return our stored status
      }
    }
    
    return {
      status: data.status,
      lastUpdated: data.updated_at
    };
  } catch (error: any) {
    console.error('Error getting campaign status:', error);
    return { error: error.message || 'Unknown error occurred' };
  }
}

// Function to update campaign status manually
export async function updateCampaignStatus(campaignId: string, status: string): Promise<boolean> {
  try {
    // Get campaign data first
    const { data: campaignData, error: getError } = await supabase
      .from('campaigns')
      .select('id, meta_data')
      .eq('id', campaignId)
      .single();
      
    if (getError) {
      console.error("Error fetching campaign:", getError);
      return false;
    }
    
    if (!campaignData) {
      return false;
    }
    
    // If we have a Facebook campaign ID, update it there too
    const metaData = campaignData.meta_data as CampaignMetaData | null;
    if (metaData && metaData.campaign_id) {
      const accessToken = await getUserAccessToken();
      if (accessToken) {
        try {
          // Map our status to Facebook status
          const fbStatus = status === 'Active' ? 'ACTIVE' : 
                         status === 'Paused' ? 'PAUSED' : 'ARCHIVED';
          
          // Update the campaign status on Facebook
          await makeMetaApiCall(
            `/${metaData.campaign_id}`,
            'POST',
            { status: fbStatus },
            accessToken
          );
        } catch (fbError) {
          console.error("Error updating Facebook campaign status:", fbError);
          // Continue with local update even if Facebook update fails
        }
      }
    }
    
    // Update in our database
    const { error } = await supabase
      .from('campaigns')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', campaignId);
      
    return !error;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return false;
  }
}
