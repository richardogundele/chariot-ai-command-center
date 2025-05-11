
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
  return credentials?.access_token || null;
}

export async function saveFacebookCredentials(credentials: FacebookCredentials): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
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
    return true;
  } catch (error) {
    console.error('Error saving Facebook credentials:', error);
    return false;
  }
}

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

    if (error || !data) return false;
    
    // Check if token is expired
    const credentials = data.credentials as CredentialsData;
    if (credentials?.expires_at && credentials.expires_at < Date.now()) {
      console.warn("Facebook token expired");
      return false;
    }
    
    // Validate token by making a simple API call
    try {
      const accessToken = credentials?.access_token;
      if (!accessToken) return false;
      
      const { makeMetaApiCall } = await import('./apiClient');
      const response = await makeMetaApiCall('/me', 'GET', undefined, accessToken);
      return !!response.id;
    } catch (error) {
      console.error("Facebook token validation failed:", error);
      return false;
    }
  } catch (error) {
    console.error('Error checking Facebook connection:', error);
    return false;
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
    return false;
  }
}
