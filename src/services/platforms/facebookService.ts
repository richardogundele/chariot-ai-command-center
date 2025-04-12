
import { supabase } from "@/integrations/supabase/client";

interface FacebookCredentials {
  accessToken: string;
  userId?: string;
  expiresAt?: number;
}

export async function saveFacebookCredentials(credentials: FacebookCredentials): Promise<boolean> {
  try {
    const { user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: user.id,
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
    const { user } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('platform_connections')
      .select('connected')
      .eq('user_id', user.id)
      .eq('platform', 'facebook')
      .single();

    if (error || !data) return false;
    return data.connected;
  } catch (error) {
    console.error('Error checking Facebook connection:', error);
    return false;
  }
}

export async function disconnectFacebook(): Promise<boolean> {
  try {
    const { user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('platform_connections')
      .update({ connected: false })
      .eq('user_id', user.id)
      .eq('platform', 'facebook');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    return false;
  }
}
