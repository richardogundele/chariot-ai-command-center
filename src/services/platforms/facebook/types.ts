
// Facebook API related interfaces and types

export interface FacebookCredentials {
  accessToken: string;
  userId?: string;
  expiresAt?: number;
}

export interface CredentialsData {
  access_token?: string;
  user_id?: string;
  expires_at?: number;
}

// Campaign meta_data interface
export interface CampaignMetaData {
  campaign_id?: string;
  ad_set_id?: string;
  ad_creative_id?: string;
  ad_id?: string;
  error?: string;
}

export interface FacebookAdAccount {
  id: string;
  name: string;
}

export interface FacebookCampaignAnalytics {
  success?: boolean;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  spend?: number;
  conversions?: number;
  cpa?: number;
  roas?: number;
  error?: string;
}

export interface CampaignStatus {
  status?: string;
  lastUpdated?: string;
  error?: string;
}

// Re-export the CampaignData interface from the parent
export type { CampaignData } from '../types';
