
import { supabase } from "@/integrations/supabase/client";
import { CampaignData, CampaignMetaData } from './types';
import { makeMetaApiCall } from './apiClient';
import { getUserAccessToken } from './auth';
import { 
  mapObjectiveToFacebook, 
  getOptimizationGoal, 
  getBillingEvent, 
  parseTargetAudience 
} from './mappers';

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
    const credentials = connectionData.credentials as { access_token?: string; user_id?: string };
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
      
      // Create the metadata object with campaign IDs
      const metaData = {
        campaign_id: metaCampaignId,
        ad_set_id: adSetId,
        ad_creative_id: adCreativeId,
        ad_id: adResponse.id
      };
      
      // Update our record with the Facebook IDs
      await supabase
        .from('campaigns')
        .update({ 
          status: campaignData.advanced?.launchImmediately ? 'Active' : 'Paused',
          meta_data: metaData
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
