import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth/authService";

export interface MetaAdAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  balance: number;
  spendCap?: number;
  status: 'ACTIVE' | 'DISABLED' | 'UNSETTLED';
}

export interface MetaCampaignConfig {
  name: string;
  objective: 'OUTCOME_TRAFFIC' | 'OUTCOME_LEADS' | 'OUTCOME_SALES' | 'OUTCOME_AWARENESS';
  budget: number;
  budgetType: 'DAILY' | 'LIFETIME';
  status: 'ACTIVE' | 'PAUSED';
  adAccountId: string;
  productId: string;
  targeting?: {
    ageMin?: number;
    ageMax?: number;
    genders?: ('male' | 'female')[];
    countries?: string[];
    interests?: string[];
    behaviors?: string[];
  };
}

export interface MetaAdCreative {
  title: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  callToAction: 'LEARN_MORE' | 'SHOP_NOW' | 'SIGN_UP' | 'CONTACT_US';
  destinationUrl: string;
}

export interface MetaCampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  spend: number;
  revenue: number;
  conversions: number;
  cpm: number; // Cost per mille (1000 impressions)
  cpc: number; // Cost per click
  ctr: number; // Click-through rate
  roas: number; // Return on ad spend
  updatedAt: string;
}

// Meta API configuration
const META_API_VERSION = 'v19.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// Get Meta access token from secure storage
async function getMetaAccessToken(): Promise<string | null> {
  try {
    // Try Supabase secrets first (most secure)
    const { data, error } = await supabase.functions.invoke('get-meta-token');
    if (!error && data?.accessToken) {
      return data.accessToken;
    }
  } catch (error) {
    console.log('Supabase secrets not available, trying database...');
  }

  // Fallback to database storage
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('key_name', 'meta_access_token')
    .maybeSingle();

  if (apiKeyError) {
    console.error("Error fetching Meta access token:", apiKeyError);
    return null;
  }

  return apiKeyData?.key_value || null;
}

// Fetch user's ad accounts
export async function fetchAdAccounts(): Promise<MetaAdAccount[]> {
  const accessToken = await getMetaAccessToken();
  if (!accessToken) {
    throw new Error('Meta access token not configured');
  }

  try {
    const response = await fetch(
      `${META_BASE_URL}/me/adaccounts?fields=id,name,currency,timezone_name,balance,spend_cap,account_status&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Meta API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((account: any) => ({
      id: account.id,
      name: account.name,
      currency: account.currency,
      timezone: account.timezone_name,
      balance: parseFloat(account.balance) / 100, // Convert from cents
      spendCap: account.spend_cap ? parseFloat(account.spend_cap) / 100 : undefined,
      status: account.account_status
    }));

  } catch (error) {
    console.error('Error fetching ad accounts:', error);
    throw new Error('Failed to fetch ad accounts from Meta');
  }
}

// Create a new campaign on Meta
export async function createMetaCampaign(
  config: MetaCampaignConfig,
  creative: MetaAdCreative
): Promise<{ campaignId: string; adSetId: string; adId: string }> {
  const accessToken = await getMetaAccessToken();
  if (!accessToken) {
    throw new Error('Meta access token not configured');
  }

  try {
    // Step 1: Create Campaign
    const campaignResponse = await fetch(
      `${META_BASE_URL}/${config.adAccountId}/campaigns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name,
          objective: config.objective,
          status: config.status,
          access_token: accessToken
        })
      }
    );

    if (!campaignResponse.ok) {
      throw new Error(`Campaign creation failed: ${campaignResponse.status}`);
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.id;

    // Step 2: Create Ad Set
    const adSetPayload = {
      name: `${config.name} - Ad Set`,
      campaign_id: campaignId,
      billing_event: 'IMPRESSIONS',
      optimization_goal: getOptimizationGoal(config.objective),
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      status: config.status,
      access_token: accessToken
    };

    // Add budget
    if (config.budgetType === 'DAILY') {
      adSetPayload.daily_budget = Math.round(config.budget * 100); // Convert to cents
    } else {
      adSetPayload.lifetime_budget = Math.round(config.budget * 100);
    }

    // Add targeting if provided
    if (config.targeting) {
      adSetPayload.targeting = {
        geo_locations: { countries: config.targeting.countries || ['GB'] },
        age_min: config.targeting.ageMin || 18,
        age_max: config.targeting.ageMax || 65,
        genders: config.targeting.genders || [1, 2], // 1=male, 2=female
        interests: config.targeting.interests?.map(interest => ({ name: interest })),
        behaviors: config.targeting.behaviors?.map(behavior => ({ name: behavior }))
      };
    }

    const adSetResponse = await fetch(
      `${META_BASE_URL}/${config.adAccountId}/adsets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adSetPayload)
      }
    );

    if (!adSetResponse.ok) {
      throw new Error(`Ad Set creation failed: ${adSetResponse.status}`);
    }

    const adSetData = await adSetResponse.json();
    const adSetId = adSetData.id;

    // Step 3: Create Ad Creative
    const creativeResponse = await fetch(
      `${META_BASE_URL}/${config.adAccountId}/adcreatives`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${config.name} - Creative`,
          object_story_spec: {
            page_id: await getPageId(), // You'll need to implement this
            link_data: {
              call_to_action: {
                type: creative.callToAction,
                value: {
                  link: creative.destinationUrl
                }
              },
              description: creative.body,
              link: creative.destinationUrl,
              message: creative.title,
              name: creative.title,
              picture: creative.imageUrl
            }
          },
          access_token: accessToken
        })
      }
    );

    if (!creativeResponse.ok) {
      throw new Error(`Creative creation failed: ${creativeResponse.status}`);
    }

    const creativeData = await creativeResponse.json();

    // Step 4: Create Ad
    const adResponse = await fetch(
      `${META_BASE_URL}/${config.adAccountId}/ads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${config.name} - Ad`,
          adset_id: adSetId,
          creative: { creative_id: creativeData.id },
          status: config.status,
          access_token: accessToken
        })
      }
    );

    if (!adResponse.ok) {
      throw new Error(`Ad creation failed: ${adResponse.status}`);
    }

    const adData = await adResponse.json();

    // Save campaign to database
    await saveCampaignToDatabase(config, campaignId, adSetId, adData.id);

    return {
      campaignId,
      adSetId: adSetId,
      adId: adData.id
    };

  } catch (error) {
    console.error('Error creating Meta campaign:', error);
    throw new Error('Failed to create campaign on Meta');
  }
}

// Fetch campaign metrics from Meta
export async function fetchCampaignMetrics(campaignIds: string[]): Promise<MetaCampaignMetrics[]> {
  const accessToken = await getMetaAccessToken();
  if (!accessToken) {
    throw new Error('Meta access token not configured');
  }

  const metrics: MetaCampaignMetrics[] = [];

  for (const campaignId of campaignIds) {
    try {
      const response = await fetch(
        `${META_BASE_URL}/${campaignId}/insights?fields=impressions,clicks,spend,actions,cpm,cpc,ctr&access_token=${accessToken}`
      );

      if (!response.ok) {
        console.error(`Failed to fetch metrics for campaign ${campaignId}`);
        continue;
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const insight = data.data[0];
        
        // Calculate revenue from conversions (if conversion tracking is set up)
        const conversions = insight.actions?.find(action => 
          action.action_type === 'purchase' || action.action_type === 'lead'
        )?.value || 0;
        
        // This would need to be calculated based on your conversion value
        const revenue = conversions * 50; // Placeholder - you'd get this from your tracking

        metrics.push({
          campaignId,
          impressions: parseInt(insight.impressions) || 0,
          clicks: parseInt(insight.clicks) || 0,
          spend: parseFloat(insight.spend) || 0,
          revenue,
          conversions: parseInt(conversions),
          cpm: parseFloat(insight.cpm) || 0,
          cpc: parseFloat(insight.cpc) || 0,
          ctr: parseFloat(insight.ctr) || 0,
          roas: revenue > 0 ? revenue / parseFloat(insight.spend || 1) : 0,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error fetching metrics for campaign ${campaignId}:`, error);
    }
  }

  return metrics;
}

// Update campaign budget
export async function updateCampaignBudget(
  adSetId: string, 
  newBudget: number, 
  budgetType: 'DAILY' | 'LIFETIME'
): Promise<void> {
  const accessToken = await getMetaAccessToken();
  if (!accessToken) {
    throw new Error('Meta access token not configured');
  }

  const budgetField = budgetType === 'DAILY' ? 'daily_budget' : 'lifetime_budget';
  const budgetValue = Math.round(newBudget * 100); // Convert to cents

  try {
    const response = await fetch(
      `${META_BASE_URL}/${adSetId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [budgetField]: budgetValue,
          access_token: accessToken
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Budget update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating campaign budget:', error);
    throw new Error('Failed to update campaign budget');
  }
}

// Pause/Resume campaign
export async function updateCampaignStatus(
  campaignId: string, 
  status: 'ACTIVE' | 'PAUSED'
): Promise<void> {
  const accessToken = await getMetaAccessToken();
  if (!accessToken) {
    throw new Error('Meta access token not configured');
  }

  try {
    const response = await fetch(
      `${META_BASE_URL}/${campaignId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          access_token: accessToken
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Status update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating campaign status:', error);
    throw new Error('Failed to update campaign status');
  }
}

// Helper functions
function getOptimizationGoal(objective: string): string {
  const goalMap = {
    'OUTCOME_TRAFFIC': 'LINK_CLICKS',
    'OUTCOME_LEADS': 'LEAD_GENERATION',
    'OUTCOME_SALES': 'OFFSITE_CONVERSIONS',
    'OUTCOME_AWARENESS': 'IMPRESSIONS'
  };
  return goalMap[objective] || 'LINK_CLICKS';
}

async function getPageId(): Promise<string> {
  // This would fetch the user's Facebook page ID
  // For now, return a placeholder - you'd implement this based on user setup
  return 'YOUR_PAGE_ID';
}

async function saveCampaignToDatabase(
  config: MetaCampaignConfig,
  campaignId: string,
  adSetId: string,
  adId: string
): Promise<void> {
  const { user } = await getCurrentUser();
  if (!user) return;

  await supabase.from('campaigns').insert({
    user_id: user.id,
    name: config.name,
    platform: 'facebook',
    budget: config.budget,
    status: config.status,
    product_id: config.productId,
    meta_data: {
      campaignId,
      adSetId,
      adId,
      objective: config.objective,
      targeting: config.targeting
    }
  });
}

// Sync campaign metrics with database
export async function syncCampaignMetrics(): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    if (!user) return;

    // Get all Meta campaigns from database
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'facebook');

    if (!campaigns || campaigns.length === 0) return;

    // Extract Meta campaign IDs
    const metaCampaignIds = campaigns
      .map(c => c.meta_data?.campaignId)
      .filter(Boolean);

    if (metaCampaignIds.length === 0) return;

    // Fetch metrics from Meta
    const metrics = await fetchCampaignMetrics(metaCampaignIds);

    // Update database with latest metrics
    for (const metric of metrics) {
      const campaign = campaigns.find(c => c.meta_data?.campaignId === metric.campaignId);
      if (campaign) {
        await supabase
          .from('campaigns')
          .update({
            meta_data: {
              ...campaign.meta_data,
              metrics: metric
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', campaign.id);
      }
    }

    console.log(`Synced metrics for ${metrics.length} campaigns`);
  } catch (error) {
    console.error('Error syncing campaign metrics:', error);
  }
}