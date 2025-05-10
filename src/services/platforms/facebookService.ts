
import { supabase } from "@/integrations/supabase/client";

interface FacebookCredentials {
  accessToken: string;
  userId?: string;
  expiresAt?: number;
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
      .select('connected')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .single();

    if (error || !data) return false;
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
}): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Check if Facebook is connected
    const fbConnected = await checkFacebookConnection();
    if (!fbConnected) {
      return { success: false, error: "Facebook account not connected" };
    }
    
    // Fix: Check if productId is "default" and handle it appropriately
    if (!campaignData.productId || campaignData.productId === "default") {
      return { success: false, error: "Valid product ID is required" };
    }
    
    // In a real implementation, this would make API calls to Facebook Marketing API
    // For now, we'll simulate by creating a record in our campaigns table
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userData.user.id,
        product_id: campaignData.productId,
        name: campaignData.name,
        platform: campaignData.platforms.includes('facebook') ? 'Facebook' : 'Multiple',
        status: 'Active',
        budget: campaignData.budget
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating campaign record:", error);
      return { success: false, error: error.message };
    }
    
    // Return the created campaign ID
    return { 
      success: true, 
      campaignId: data.id 
    };
  } catch (error) {
    console.error('Error creating Facebook campaign:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New function to get Facebook ad campaign analytics
export async function getFacebookCampaignAnalytics(campaignId: string): Promise<{
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
