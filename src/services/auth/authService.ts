
import { supabase } from "@/integrations/supabase/client";

// Authentication functions
export async function signUp(email: string, password: string, fullName?: string): Promise<{ user: any; error: any }> {
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName || ''
      }
    }
  });
  
  return { 
    user: data.user, 
    error 
  };
}

export async function signIn(email: string, password: string): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  // Set local storage for compatibility with existing code
  if (data.user) {
    localStorage.setItem("isAuthenticated", "true");
  }
  
  return { 
    user: data.user, 
    error 
  };
}

export async function signOut(): Promise<{ error: any }> {
  // Always clear local storage
  localStorage.removeItem("isAuthenticated");
  
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.getUser();
  return { 
    user: data?.user || null, 
    error 
  };
}
