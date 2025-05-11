
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
    
    // Get ad accounts for this user
    const adAccountsResponse = await makeMetaApiCall(`/${userResponse.id}/adaccounts`, 'GET', undefined, accessToken);
    
    if (!adAccountsResponse.data || !Array.isArray(adAccountsResponse.data)) {
      return { success: false, error: "Failed to retrieve ad accounts" };
    }
    
    // Format the response
    const accounts = adAccountsResponse.data.map((account: any) => ({
      id: account.id,
      name: account.name || account.id
    }));
    
    return {
      success: true,
      accounts
    };
  } catch (error: any) {
    console.error('Error fetching Facebook ad accounts:', error);
    return { 
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}
