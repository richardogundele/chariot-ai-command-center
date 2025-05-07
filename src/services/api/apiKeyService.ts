
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches an API key from the database by name
 * @param keyName The name of the API key to fetch
 * @returns The API key value or null if not found
 */
export async function getApiKey(keyName: string): Promise<string | null> {
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

/**
 * Updates or creates an API key in the database
 * @param keyName The name of the API key
 * @param keyValue The value of the API key
 * @returns Whether the operation was successful
 */
export async function updateApiKey(keyName: string, keyValue: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .upsert({ key_name: keyName, key_value: keyValue })
      .select();

    if (error) {
      console.error(`Error updating ${keyName}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error updating ${keyName}:`, error);
    return false;
  }
}
