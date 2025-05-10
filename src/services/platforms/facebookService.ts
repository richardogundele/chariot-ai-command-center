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
    
    return data.connected;
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

// New function to create a Facebook ad campaign
export async function createFacebookCampaign(campaignData: {
  name: string;
  objective: string;
  budget: number;
  duration: number;
  productId: string;
  targetAudience: string;
  platforms: string[];
  advanced?: Record<string, any>;
}): Promise<{ success: boolean; campaignId?: string; error?: string; status?: string }> {
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
    
    // Fix: Check if productId is "default" and handle it appropriately
    if (!campaignData.productId || campaignData.productId === "default") {
      return { success: false, error: "Valid product ID is required" };
    }
    
    // First create a record in our campaigns table
    const { data: campaignRecord, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        user_id: userData.user.id,
        product_id: campaignData.productId,
        name: campaignData.name,
        platform: campaignData.platforms.includes('facebook') ? 'Facebook' : 'Multiple',
        status: 'Pending', // Set as pending initially
        budget: campaignData.budget
      })
      .select()
      .single();
    
    if (campaignError || !campaignRecord) {
      console.error("Error creating campaign record:", campaignError);
      return { success: false, error: campaignError?.message || "Failed to create campaign record" };
    }
    
    // In a real implementation, this would make API calls to Facebook Marketing API
    // We'll simulate this process with a delay
    
    // Call the Facebook Graph API to create a campaign
    // Note: In a real implementation, you would use the Facebook SDK or make API calls
    try {
      const credentials = connectionData.credentials as CredentialsData;
      const accessToken = credentials?.access_token;
      
      if (!accessToken) {
        throw new Error("Facebook access token not found");
      }
      
      // Simulation: Update campaign to "Active" after a brief delay
      // In a real implementation, this would be replaced with actual API calls
      setTimeout(async () => {
        await supabase
          .from('campaigns')
          .update({ status: 'Active' })
          .eq('id', campaignRecord.id);
      }, 2000);
      
      // Return the created campaign ID
      return { 
        success: true, 
        campaignId: campaignRecord.id,
        status: 'Pending',
      };
    } catch (fbError) {
      // If Facebook API call fails, update our record to reflect the failure
      await supabase
        .from('campaigns')
        .update({ status: 'Failed' })
        .eq('id', campaignRecord.id);
        
      return { 
        success: false,
        error: fbError instanceof Error ? fbError.message : 'Facebook API error',
      };
    }
  } catch (error) {
    console.error('Error creating Facebook campaign:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New function to get Facebook ad account information
export async function getFacebookAdAccounts(): Promise<{
  success: boolean;
  accounts?: Array<{ id: string, name: string }>;
  error?: string;
}> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    
    const { data, error } = await supabase
      .from('platform_connections')
      .select('credentials')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .eq('connected', true)
      .single();
      
    if (error || !data) {
      return { success: false, error: "Facebook account not connected or missing access token" };
    }
    
    const credentials = data.credentials as CredentialsData;
    if (!credentials.access_token) {
      return { success: false, error: "Facebook access token not found" };
    }
    
    // In a real implementation, make API call to Facebook Marketing API
    // For now, return mock data
    return {
      success: true,
      accounts: [
        { id: 'act_123456789', name: 'Primary Ad Account' },
        { id: 'act_987654321', name: 'Business Ad Account' }
      ]
    };
  } catch (error) {
    console.error('Error fetching Facebook ad accounts:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New function to get Facebook ad campaign analytics
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
      .select('id, status')
      .eq('id', campaignId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (campaignError || !campaignData) {
      return { success: false, error: "Campaign not found" };
    }
    
    // In a real implementation, this would make API calls to Facebook Marketing API
    // For now, we'll simulate analytics data
    
    // Generate some random data for demonstration
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
  } catch (error) {
    console.error('Error fetching Facebook campaign analytics:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New function to get campaign status
export async function getCampaignStatus(campaignId: string): Promise<{
  status?: string;
  lastUpdated?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('status, updated_at')
      .eq('id', campaignId)
      .single();
      
    if (error || !data) {
      return { error: "Campaign not found" };
    }
    
    return {
      status: data.status,
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error('Error getting campaign status:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Function to update campaign status manually
export async function updateCampaignStatus(campaignId: string, status: string): Promise<boolean> {
  try {
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
