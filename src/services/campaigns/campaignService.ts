import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth/authService";

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  status: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  meta_data?: any;
}

export interface CreateCampaignPayload {
  name: string;
  platform: string;
  budget: number;
  product_id: string;
  status?: string;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      platform: item.platform,
      budget: parseFloat(String(item.budget)) || 0,
      status: item.status,
      product_id: item.product_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      meta_data: item.meta_data
    }));
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function createCampaign(campaignData: CreateCampaignPayload): Promise<Campaign | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        user_id: user.id,
        name: campaignData.name,
        platform: campaignData.platform,
        budget: campaignData.budget,
        product_id: campaignData.product_id,
        status: campaignData.status || 'Draft',
        meta_data: {}
      }])
      .select()
      .single();

    if (error) throw error;

    if (data) {
      return {
        id: data.id,
        name: data.name,
        platform: data.platform,
        budget: parseFloat(String(data.budget)) || 0,
        status: data.status,
        product_id: data.product_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        meta_data: data.meta_data
      };
    }

    return null;
  } catch (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
}

export async function updateCampaign(campaignId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', campaignId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return false;
  }
}

export async function deleteCampaign(campaignId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return false;
  }
}