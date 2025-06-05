
import { makeMetaApiCall } from './apiClient';
import { getUserAccessToken } from './auth';
import { FacebookAdAccount } from './types';

// Function to get Facebook ad accounts
export async function getFacebookAdAccounts(): Promise<{
  success: boolean;
  accounts?: FacebookAdAccount[];
  error?: string;
}> {
  try {
    const accessToken = await getUserAccessToken();
    
    if (!accessToken) {
      return { success: false, error: "Facebook account not connected or missing access token" };
    }
    
    // Get user ID first
    const userResponse = await makeMetaApiCall('/me', 'GET', undefined, accessToken);
    
    if (!userResponse.id) {
      return { success: false, error: "Failed to retrieve Facebook user ID" };
    }
    
    console.log("Fetching ad accounts for user:", userResponse.id);
    
    // Get ad accounts for this user with proper error handling
    try {
      const adAccountsResponse = await makeMetaApiCall(
        `/me/adaccounts?fields=id,name,account_status,capabilities`, 
        'GET', 
        undefined, 
        accessToken
      );
      
      if (!adAccountsResponse.data || !Array.isArray(adAccountsResponse.data)) {
        console.log("No ad accounts found or invalid response:", adAccountsResponse);
        return { success: false, error: "No ad accounts found for this Facebook account" };
      }
      
      // Filter for accounts that have proper capabilities and are active
      const validAccounts = adAccountsResponse.data.filter((account: any) => {
        const isActive = account.account_status === 1; // 1 = ACTIVE
        const hasCreateCampaignCapability = account.capabilities && 
          account.capabilities.includes('CAN_CREATE_BRAND_CAMPAIGN');
        
        console.log(`Account ${account.id}: status=${account.account_status}, capabilities=${JSON.stringify(account.capabilities)}`);
        
        return isActive || hasCreateCampaignCapability; // Accept if either condition is met
      });
      
      if (validAccounts.length === 0) {
        return { 
          success: false, 
          error: "No active ad accounts with campaign creation permissions found. Please ensure your Facebook account has proper ad account access." 
        };
      }
      
      // Format the response
      const accounts = validAccounts.map((account: any) => ({
        id: account.id,
        name: account.name || `Ad Account ${account.id.replace('act_', '')}`
      }));
      
      console.log("Valid ad accounts found:", accounts);
      
      return {
        success: true,
        accounts
      };
    } catch (apiError: any) {
      console.error("Error fetching ad accounts:", apiError);
      
      // Handle specific permission errors
      if (apiError.message && apiError.message.includes('Missing Permissions')) {
        return { 
          success: false, 
          error: "Your Facebook app doesn't have permission to access ad accounts. Please reconnect with proper permissions." 
        };
      }
      
      return { 
        success: false,
        error: apiError.message || 'Failed to retrieve ad accounts'
      };
    }
  } catch (error: any) {
    console.error('Error in getFacebookAdAccounts:', error);
    return { 
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}
