
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/components/settings/AccountSettings";

/**
 * Fetches user profile data from the database
 * @returns The user profile or null if not found
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn("No authenticated user found");
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('full_name, company, job_title, phone')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.warn("Error fetching user profile:", error.message);
      }
      return null;
    }
    
    // Map database column names to our interface property names
    const mappedProfile = {
      fullName: data?.full_name || '',
      company: data?.company || '',
      jobTitle: data?.job_title || '',
      phone: data?.phone || ''
    };
    
    return mappedProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
}

/**
 * Updates the user's profile information in the database
 * @param profile The user profile data to save
 * @returns Whether the operation was successful
 */
export async function updateUserProfile(profile: UserProfile): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Map our interface property names to database column names
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        full_name: profile.fullName,
        company: profile.company,
        job_title: profile.jobTitle,
        phone: profile.phone,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return false;
  }
}

/**
 * Checks if a user has completed their profile setup
 * @returns Whether the user has a profile set up
 */
export async function hasUserCompletedSetup(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    const apiKeys = await checkRequiredApiKeys();
    
    // Consider the setup complete if both profile exists and has a name AND at least one API key is set
    return !!(profile?.fullName && apiKeys);
  } catch (error) {
    console.error("Error checking if user completed setup:", error);
    return false;
  }
}

/**
 * Checks if required API keys are set
 * @returns Whether the required API keys are set
 */
async function checkRequiredApiKeys(): Promise<boolean> {
  try {
    const openAIKey = await getApiKey('openai_api_key');
    // For now, we only require the OpenAI API key
    return !!openAIKey;
  } catch (error) {
    console.error("Error checking required API keys:", error);
    return false;
  }
}

async function getApiKey(keyName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', keyName)
      .single();

    if (error) {
      console.error(`Error fetching ${keyName}:`, error);
      return null;
    }

    return data?.key_value || null;
  } catch (error) {
    console.error(`Error fetching ${keyName}:`, error);
    return null;
  }
}
