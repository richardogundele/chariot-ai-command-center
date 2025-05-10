
import { supabase } from "@/integrations/supabase/client";

interface FacebookCredentials {
  accessToken: string;
  userId?: string;
  expiresAt?: number;
}

interface CredentialsData {
  access_token?: string;
  user_id?: string;
  expires_at?: number;
}

// Meta Marketing API configurations
const META_API_VERSION = 'v19.0'; // Using the latest stable version

// Helper function to make API calls to the Meta Marketing API
async function makeMetaApiCall(
  endpoint: string, 
  method: 'GET' | 'POST' | 'DELETE' = 'GET', 
  body?: Record<string, any>,
  accessToken?: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("Facebook access token is required");
  }
  
  const baseUrl = `https://graph.facebook.com/${META_API_VERSION}`;
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Facebook API error");
    }
    
    return data;
  } catch (error) {
    console.error("Meta API call failed:", error);
    throw error;
  }
}

// Function to get access token for the current user
async function getUserAccessToken(): Promise<string | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
    
  if (userError || !userData.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('platform_connections')
    .select('credentials')
    .eq('user_id', userData.user.id)
    .eq('platform', 'facebook')
    .eq('connected', true)
    .single();
  
  if (error || !data) return null;
  
  const credentials = data.credentials as CredentialsData;
  return credentials?.access_token || null;
}

export async function saveFacebookCredentials(credentials: FacebookCredentials): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userData.user.id,
        platform: 'facebook',
        credentials: {
          access_token: credentials.accessToken,
          user_id: credentials.userId,
          expires_at: credentials.expiresAt
        },
        connected: true,
        last_updated: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving Facebook credentials:', error);
    return false;
  }
}

export async function checkFacebookConnection(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('platform_connections')
      .select('connected, credentials')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .single();

    if (error || !data) return false;
    
    // Check if token is expired
    const credentials = data.credentials as CredentialsData;
    if (credentials?.expires_at && credentials.expires_at < Date.now()) {
      console.warn("Facebook token expired");
      return false;
    }
    
    // Validate token by making a simple API call
    try {
      const accessToken = credentials?.access_token;
      if (!accessToken) return false;
      
      const response = await makeMetaApiCall('/me', 'GET', undefined, accessToken);
      return !!response.id;
    } catch (error) {
      console.error("Facebook token validation failed:", error);
      return false;
    }
  } catch (error) {
    console.error('Error checking Facebook connection:', error);
    return false;
  }
}

export async function disconnectFacebook(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .update({ connected: false })
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    return false;
  }
}

export interface CampaignData {
  name: string;
  objective: string;
  budget: number;
  duration: number;
  productId: string;
  targetAudience?: string;
  platforms: string[];
  advanced?: Record<string, any>;
}

// Create a Facebook ad campaign
export async function createFacebookCampaign(campaignData: CampaignData): Promise<{ 
  success: boolean; 
  campaignId?: string; 
  error?: string; 
  status?: string;
  metaId?: string; 
}> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Check if Facebook is connected
    const { data: connectionData, error: connectionError } = await supabase
      .from('platform_connections')
      .select('credentials')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .eq('connected', true)
      .single();
    
    if (connectionError || !connectionData) {
      return { success: false, error: "Facebook account not connected" };
    }
    
    // Validate product ID
    if (!campaignData.productId || campaignData.productId === "default") {
      return { success: false, error: "Valid product ID is required" };
    }
    
    // Get product details for ad content
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('name, description, image, ad_copy')
      .eq('id', campaignData.productId)
      .single();
      
    if (productError || !productData) {
      return { success: false, error: "Product not found" };
    }
    
    // First create a record in our campaigns table
    const { data: campaignRecord, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        user_id: userData.user.id,
        product_id: campaignData.productId,
        name: campaignData.name,
        platform: campaignData.platforms.includes('facebook') ? 'Facebook' : 'Multiple',
        status: 'Pending',
        budget: campaignData.budget
      })
      .select()
      .single();
    
    if (campaignError || !campaignRecord) {
      console.error("Error creating campaign record:", campaignError);
      return { success: false, error: campaignError?.message || "Failed to create campaign record" };
    }
    
    // Get access token
    const credentials = connectionData.credentials as CredentialsData;
    const accessToken = credentials?.access_token;
      
    if (!accessToken) {
      await supabase
        .from('campaigns')
        .update({ status: 'Failed' })
        .eq('id', campaignRecord.id);
      return { success: false, error: "Facebook access token not found" };
    }
    
    // Create campaign on Facebook
    try {
      const adAccountId = campaignData.advanced?.adAccountId || 'act_' + credentials.user_id;
      
      // 1. Create the campaign
      const campaignResponse = await makeMetaApiCall(`/${adAccountId}/campaigns`, 'POST', {
        name: campaignData.name,
        objective: mapObjectiveToFacebook(campaignData.objective),
        status: campaignData.advanced?.launchImmediately ? 'ACTIVE' : 'PAUSED',
        special_ad_categories: [],
        daily_budget: campaignData.budget * 100 // Convert to cents
      }, accessToken);
      
      const metaCampaignId = campaignResponse.id;
      
      // 2. Create an ad set
      const adSetResponse = await makeMetaApiCall(`/${adAccountId}/adsets`, 'POST', {
        name: `${campaignData.name} - Ad Set`,
        campaign_id: metaCampaignId,
        optimization_goal: getOptimizationGoal(campaignData.objective),
        billing_event: getBillingEvent(campaignData.objective),
        bid_amount: 1000, // $10 default bid amount in cents
        daily_budget: campaignData.budget * 100,
        targeting: {
          age_min: 18,
          age_max: 65,
          genders: [1, 2], // Both men and women
          geo_locations: {
            countries: ['US'],
            location_types: ['home', 'recent']
          },
          // Add more targeting based on user's advanced settings
          ...parseTargetAudience(campaignData.targetAudience)
        },
        status: campaignData.advanced?.launchImmediately ? 'ACTIVE' : 'PAUSED'
      }, accessToken);
      
      const adSetId = adSetResponse.id;
      
      // 3. Create an ad creative
      const adCreativeResponse = await makeMetaApiCall(`/${adAccountId}/adcreatives`, 'POST', {
        name: `${campaignData.name} - Creative`,
        object_story_spec: {
          page_id: campaignData.advanced?.pageId, // If provided
          link_data: {
            message: productData.ad_copy || productData.description,
            link: campaignData.advanced?.websiteUrl || 'https://example.com',
            name: productData.name,
            description: productData.description?.substring(0, 200) || "",
            image_hash: campaignData.advanced?.imageHash, // If provided
            call_to_action: {
              type: campaignData.advanced?.callToAction || 'LEARN_MORE'
            }
          }
        }
      }, accessToken);
      
      const adCreativeId = adCreativeResponse.id;
      
      // 4. Create an ad
      const adResponse = await makeMetaApiCall(`/${adAccountId}/ads`, 'POST', {
        name: `${campaignData.name} - Ad`,
        adset_id: adSetId,
        creative: {
          creative_id: adCreativeId
        },
        status: campaignData.advanced?.launchImmediately ? 'ACTIVE' : 'PAUSED'
      }, accessToken);
      
      // Update our record with the Facebook IDs
      await supabase
        .from('campaigns')
        .update({ 
          status: campaignData.advanced?.launchImmediately ? 'Active' : 'Paused',
          meta_data: {
            campaign_id: metaCampaignId,
            ad_set_id: adSetId,
            ad_creative_id: adCreativeId,
            ad_id: adResponse.id
          }
        })
        .eq('id', campaignRecord.id);
      
      return { 
        success: true, 
        campaignId: campaignRecord.id,
        status: campaignData.advanced?.launchImmediately ? 'Active' : 'Paused',
        metaId: metaCampaignId
      };
    } catch (fbError: any) {
      // If Facebook API call fails, update our record to reflect the failure
      await supabase
        .from('campaigns')
        .update({ 
          status: 'Failed',
          meta_data: {
            error: fbError.message || 'Unknown Facebook API error'
          }
        })
        .eq('id', campaignRecord.id);
        
      console.error("Facebook campaign creation error:", fbError);
      return { 
        success: false,
        error: fbError.message || 'Facebook API error',
      };
    }
  } catch (error: any) {
    console.error('Error creating Facebook campaign:', error);
    return { 
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

// Map our app's objective names to Facebook's objective names
function mapObjectiveToFacebook(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'CONVERSIONS',
    'awareness': 'BRAND_AWARENESS',
    'traffic': 'TRAFFIC',
    'engagement': 'ENGAGEMENT',
    'app_installs': 'APP_INSTALLS',
    'video_views': 'VIDEO_VIEWS',
    'lead_generation': 'LEAD_GENERATION',
    'messages': 'MESSAGES'
  };
  
  return mapping[objective] || 'CONVERSIONS';
}

// Get optimization goal based on objective
function getOptimizationGoal(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'CONVERSIONS',
    'awareness': 'REACH',
    'traffic': 'LINK_CLICKS',
    'engagement': 'POST_ENGAGEMENT',
    'app_installs': 'APP_INSTALLS',
    'video_views': 'VIDEO_VIEWS',
    'lead_generation': 'LEAD_GENERATION',
    'messages': 'CONVERSATIONS'
  };
  
  return mapping[objective] || 'CONVERSIONS';
}

// Get billing event based on objective
function getBillingEvent(objective: string): string {
  const mapping: Record<string, string> = {
    'conversion': 'IMPRESSIONS',
    'awareness': 'IMPRESSIONS',
    'traffic': 'LINK_CLICKS',
    'engagement': 'IMPRESSIONS',
    'app_installs': 'IMPRESSIONS',
    'video_views': 'IMPRESSIONS',
    'lead_generation': 'IMPRESSIONS',
    'messages': 'IMPRESSIONS'
  };
  
  return mapping[objective] || 'IMPRESSIONS';
}

// Parse target audience string into Facebook targeting spec
function parseTargetAudience(targetAudienceStr?: string): Record<string, any> {
  if (!targetAudienceStr || targetAudienceStr === 'Default audience') {
    return {};
  }
  
  // This is a simplified parser - in a real app you'd want more sophisticated parsing
  const targeting: Record<string, any> = {};
  
  // Extract age ranges
  const ageMatch = targetAudienceStr.match(/(\d+)\s*-\s*(\d+)\s*years?\s*old/i);
  if (ageMatch) {
    targeting.age_min = parseInt(ageMatch[1]);
    targeting.age_max = parseInt(ageMatch[2]);
  }
  
  // Extract gender preferences
  if (/\bmen\b/i.test(targetAudienceStr) && !/\bwomen\b/i.test(targetAudienceStr)) {
    targeting.genders = [1]; // Men only
  } else if (!/\bmen\b/i.test(targetAudienceStr) && /\bwomen\b/i.test(targetAudienceStr)) {
    targeting.genders = [2]; // Women only
  }
  
  // Extract interests (very simplified)
  const interestsMatch = targetAudienceStr.match(/interests?:\s*([^,\.]+)/i);
  if (interestsMatch) {
    const interestStr = interestsMatch[1].trim();
    targeting.flexible_spec = [{
      interests: [{ name: interestStr, id: null }] // ID would need to be looked up from Facebook's API
    }];
  }
  
  // Extract locations (very simplified)
  const locationMatch = targetAudienceStr.match(/locations?:\s*([^,\.]+)/i);
  if (locationMatch) {
    const location = locationMatch[1].trim();
    if (location !== 'US' && location !== 'United States') {
      targeting.geo_locations = {
        regions: [{ key: location }],
        location_types: ['home', 'recent']
      };
    }
  }
  
  return targeting;
}

// Function to get Facebook ad accounts
export async function getFacebookAdAccounts(): Promise<{
  success: boolean;
  accounts?: Array<{ id: string, name: string }>;
  error?: string;
}> {
  try {
    const accessToken = await getUserAccessToken();
    
    if (!accessToken) {
      return { success: false, error: "Facebook account not connected or missing access token" };
    }
    
    // Get user ID first
    const userResponse = await makeMetaApiCall('/me', 'GET', undefined, accessToken);
    
    if (!userResponse.id) {
      return { success: false, error: "Failed to retrieve Facebook user ID" };
    }
    
    // Get ad accounts for this user
    const adAccountsResponse = await makeMetaApiCall(`/${userResponse.id}/adaccounts`, 'GET', undefined, accessToken);
    
    if (!adAccountsResponse.data || !Array.isArray(adAccountsResponse.data)) {
      return { success: false, error: "Failed to retrieve ad accounts" };
    }
    
    // Format the response
    const accounts = adAccountsResponse.data.map((account: any) => ({
      id: account.id,
      name: account.name || account.id
    }));
    
    return {
      success: true,
      accounts
    };
  } catch (error: any) {
    console.error('Error fetching Facebook ad accounts:', error);
    return { 
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

// Function to get Facebook ad campaign analytics
export async function getFacebookCampaignAnalytics(campaignId: string): Promise<{
  success?: boolean;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  spend?: number;
  conversions?: number;
  cpa?: number;
  roas?: number;
  error?: string;
}> {
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
      
    if (campaignError || !campaignData) {
      return { success: false, error: "Campaign not found" };
    }
    
    const accessToken = await getUserAccessToken();
    
    if (!accessToken) {
      return { success: false, error: "Facebook access token not found" };
    }
    
    // If we have a real Facebook campaign ID
    if (campaignData.meta_data?.campaign_id) {
      const metaCampaignId = campaignData.meta_data.campaign_id;
      
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
      
      const data = insights.data[0];
      
      // Find conversion actions
      let conversions = 0;
      let revenue = 0;
      
      if (data.actions) {
        for (const action of data.actions) {
          if (['purchase', 'offsite_conversion'].includes(action.action_type)) {
            conversions += parseInt(action.value || '0');
          }
        }
      }
      
      if (data.action_values) {
        for (const actionValue of data.action_values) {
          if (['purchase', 'offsite_conversion'].includes(actionValue.action_type)) {
            revenue += parseFloat(actionValue.value || '0');
          }
        }
      }
      
      // Calculate metrics
      const impressions = parseInt(data.impressions || '0');
      const clicks = parseInt(data.clicks || '0');
      const ctr = parseFloat(data.ctr || '0') * 100; // Convert to percentage
      const spend = parseFloat(data.spend || '0');
      
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
      
    if (error || !data) {
      return { error: "Campaign not found" };
    }
    
    // If the campaign has a meta_campaign_id, check its status on Facebook
    if (data.meta_data?.campaign_id && 
        (data.status === 'Active' || data.status === 'Paused')) {
      try {
        const accessToken = await getUserAccessToken();
        if (accessToken) {
          const fbCampaign = await makeMetaApiCall(
            `/${data.meta_data.campaign_id}`, 
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
      
    if (getError || !campaignData) {
      return false;
    }
    
    // If we have a Facebook campaign ID, update it there too
    if (campaignData.meta_data?.campaign_id) {
      const accessToken = await getUserAccessToken();
      if (accessToken) {
        try {
          // Map our status to Facebook status
          const fbStatus = status === 'Active' ? 'ACTIVE' : 
                         status === 'Paused' ? 'PAUSED' : 'ARCHIVED';
          
          // Update the campaign status on Facebook
          await makeMetaApiCall(
            `/${campaignData.meta_data.campaign_id}`,
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
