
// Shared types across all platforms

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
