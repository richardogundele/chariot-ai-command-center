
import { META_API_VERSION } from './config';
import { getUserAccessToken } from './auth';

// Helper function to make API calls to the Meta Marketing API
export async function makeMetaApiCall(
  endpoint: string, 
  method: 'GET' | 'POST' | 'DELETE' = 'GET', 
  body?: Record<string, any>,
  accessToken?: string
): Promise<any> {
  if (!accessToken) {
    try {
      const storedToken = await getUserAccessToken();
      if (!storedToken) {
        throw new Error("Facebook access token is required. Please connect your Facebook account.");
      }
      accessToken = storedToken;
    } catch (error) {
      // Pass through token validation errors
      throw error;
    }
  }
  
  const baseUrl = `https://graph.facebook.com/${META_API_VERSION}`;
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Enhanced error handling for token-related issues
      if (data.error && data.error.message) {
        if (data.error.message.includes("access token") || 
            data.error.message.includes("expired") || 
            data.error.message.includes("Session")) {
          throw new Error(data.error.message);
        }
      }
      throw new Error(data.error?.message || "Facebook API error");
    }
    
    return data;
  } catch (error) {
    console.error("Meta API call failed:", error);
    throw error;
  }
}

// Get basic information about the user associated with the token
export async function getFacebookUserInfo(accessToken: string): Promise<{id: string, name: string} | null> {
  try {
    const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/me?fields=id,name&access_token=${accessToken}`);
    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error("Failed to get user info:", data.error?.message || "Unknown error");
      return null;
    }
    
    return {
      id: data.id,
      name: data.name
    };
  } catch (error) {
    console.error("Error fetching Facebook user info:", error);
    return null;
  }
}
