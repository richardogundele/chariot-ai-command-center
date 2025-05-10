
// Re-export all services
export * from './auth/authService';
export * from './products/productService';
export * from './products/types';
export * from './api/apiKeyService';
export * from './products/aiGenerationService';
export * from './platforms/facebookService';
export * from './platforms/tiktokService';

// Export campaign data interface
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
