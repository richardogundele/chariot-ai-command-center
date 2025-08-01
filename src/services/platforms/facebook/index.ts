
// Main entry point for Facebook services - re-export all functions

// Auth related functions
export { 
  saveFacebookCredentials,
  checkFacebookConnection, 
  disconnectFacebook,
  getUserAccessToken,
  validateFacebookToken
} from './auth';

// API client functions
export { 
  getFacebookUserInfo 
} from './apiClient';

// Campaign related functions
export { 
  createFacebookCampaign 
} from './campaignService';

// Analytics related functions
export { 
  getFacebookCampaignAnalytics,
  getCampaignStatus,
  updateCampaignStatus
} from './analyticsService';

// Ad account related functions
export { 
  getFacebookAdAccounts 
} from './adAccountsService';

// Type exports
export * from './types';
