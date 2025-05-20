
import { supabase } from "@/integrations/supabase/client";
import { FacebookCredentials, CredentialsData } from './types';

// Function to get access token for the current user
export async function getUserAccessToken(): Promise<string | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
    
  if (userError || !userData.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('platform_connections')
    .select('credentials')
    .eq('user_id', userData.user.id)
    .eq('platform', 'facebook')
    .eq('connected', true)
    .single();
  
  if (error || !data) return null;
  
  const credentials = data.credentials as CredentialsData;
  
  // Check if token is expired
  if (credentials?.expires_at && credentials.expires_at < Date.now()) {
    throw new Error("Facebook token has expired. Please reconnect your Facebook account.");
  }
  
  return credentials?.access_token || null;
}

export async function saveFacebookCredentials(credentials: FacebookCredentials): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Check for existing connection first
    const { data: existingData } = await supabase
      .from('platform_connections')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .single();
      
    if (existingData) {
      // Update existing record instead of inserting new one
      const { error } = await supabase
        .from('platform_connections')
        .update({
          credentials: {
            access_token: credentials.accessToken,
            user_id: credentials.userId,
            expires_at: credentials.expiresAt
          },
          connected: true,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingData.id);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('platform_connections')
        .insert({
          user_id: userData.user.id,
          platform: 'facebook',
          credentials: {
            access_token: credentials.accessToken,
            user_id: credentials.userId,
            expires_at: credentials.expiresAt
          },
          connected: true,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Facebook credentials:', error);
    throw error;
  }
}

/**
 * Validates a Facebook access token directly against the Facebook Graph API
 * This is useful to detect if a token is still valid or has been revoked
 */
export async function validateFacebookToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${accessToken}&access_token=${accessToken}`);
    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error("Token validation failed:", data.error?.message || "Unknown error");
      return false;
    }
    
    // Check if token is valid and not expired
    return data.data?.is_valid === true;
  } catch (error) {
    console.error("Error validating Facebook token:", error);
    return false;
  }
}

/**
 * Checks if the user has a valid Facebook connection
 * 
 * Facebook access tokens typically expire after a set period (usually 60 days).
 * When this happens, users need to reconnect their Facebook account.
 * This function validates if:
 * 1. The user has connected their Facebook account
 * 2. The token has not expired
 * 3. The token is still valid by making a test API call
 */
export async function checkFacebookConnection(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('platform_connections')
      .select('connected, credentials')
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook')
      .single();

    if (error || !data || !data.connected) return false;
    
    // Check if token is expired
    const credentials = data.credentials as CredentialsData;
    if (!credentials?.access_token) return false;
    
    if (credentials?.expires_at && credentials.expires_at < Date.now()) {
      throw new Error("Facebook token has expired. Please reconnect your Facebook account.");
    }
    
    // Validate token by making a simple API call
    try {
      const isValid = await validateFacebookToken(credentials.access_token);
      if (!isValid) {
        throw new Error("Facebook token is no longer valid. Please reconnect your account.");
      }
      return true;
    } catch (error) {
      console.error("Facebook token validation failed:", error);
      // Pass through the original error
      throw error;
    }
  } catch (error) {
    console.error('Error checking Facebook connection:', error);
    throw error;
  }
}

export async function disconnectFacebook(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .update({ connected: false })
      .eq('user_id', userData.user.id)
      .eq('platform', 'facebook');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    throw error;
  }
}
