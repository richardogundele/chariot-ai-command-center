
import { supabase } from "@/integrations/supabase/client";
import { CampaignData } from "../index";

interface TikTokCredentials {
  accessToken: string;
  userId?: string;
  expiresAt?: number;
}

interface CredentialsData {
  access_token?: string;
  user_id?: string;
  expires_at?: number;
}

export async function saveTikTokCredentials(credentials: TikTokCredentials): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userData.user.id,
        platform: 'tiktok',
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
    console.error('Error saving TikTok credentials:', error);
    return false;
  }
}

export async function checkTikTokConnection(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('platform_connections')
      .select('connected, credentials')
      .eq('user_id', userData.user.id)
      .eq('platform', 'tiktok')
      .single();

    if (error || !data) return false;
    
    // Check if token is expired
    const credentials = data.credentials as CredentialsData;
    if (credentials?.expires_at && credentials.expires_at < Date.now()) {
      console.warn("TikTok token expired");
      return false;
    }
    
    return data.connected;
  } catch (error) {
    console.error('Error checking TikTok connection:', error);
    return false;
  }
}

export async function disconnectTikTok(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .update({ connected: false })
      .eq('user_id', userData.user.id)
      .eq('platform', 'tiktok');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting TikTok:', error);
    return false;
  }
}

// Create a TikTok ad campaign
export async function createTikTokCampaign(campaignData: CampaignData): Promise<{ 
  success: boolean; 
  campaignId?: string; 
  error?: string;
  status?: string; 
}> {
  // Implementation will be added when TikTok integration is fully developed
  return { 
    success: false, 
    error: "TikTok campaign creation is not yet implemented"
  };
}

// Get TikTok ad campaign analytics
export async function getTikTokCampaignAnalytics(campaignId: string): Promise<{
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
  // Implementation will be added when TikTok integration is fully developed
  return { 
    success: false, 
    error: "TikTok analytics retrieval is not yet implemented"
  };
}

// Get TikTok campaign status
export async function getTikTokCampaignStatus(campaignId: string): Promise<{
  status?: string;
  lastUpdated?: string;
  error?: string;
}> {
  // Implementation will be added when TikTok integration is fully developed
  return { 
    error: "TikTok status retrieval is not yet implemented" 
  };
}

// Update TikTok campaign status
export async function updateTikTokCampaignStatus(campaignId: string, status: string): Promise<boolean> {
  // Implementation will be added when TikTok integration is fully developed
  return false;
}
