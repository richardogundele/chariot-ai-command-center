
import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/components/products/ProductsData';
import { Database } from '@/integrations/supabase/types';

// Import the supabase client from our integrations
import { supabase } from "@/integrations/supabase/client";
import { generateAdCopy, generateProductImage } from '@/utils/openai';

export interface CreateProductPayload {
  name: string;
  description: string;
  adCopy: string;
  image: string;
  platforms: string[];
  status: string;
  price?: number;
}

// Authentication functions
export async function signUp(email: string, password: string): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password 
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

export async function saveProduct(product: CreateProductPayload): Promise<Product | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        user_id: user.id,
        name: product.name,
        description: product.description,
        status: product.status || 'Draft',
        metrics: {
          sales: 0,
          revenue: 0,
          roas: 0
        },
        price: product.price || null,
        platforms: product.platforms,
        ad_copy: product.adCopy,
        image: product.image,
      }])
      .select()
      .single();

    if (error) throw error;

    if (data) {
      // Transform database record to match our Product interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        metrics: {
          sales: typeof data.metrics === 'object' ? data.metrics.sales || 0 : 0,
          revenue: typeof data.metrics === 'object' ? data.metrics.revenue || 0 : 0,
          roas: typeof data.metrics === 'object' ? data.metrics.roas || 0 : 0
        },
        lastUpdated: new Date(data.updated_at).toLocaleDateString(),
        platforms: data.platforms || [],
        adCopy: data.ad_copy,
        image: data.image,
        insights: []
      };
    }

    return null;
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      console.warn('User not authenticated, returning mock data');
      return getMockProducts();
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('deleted', false)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      status: item.status,
      metrics: {
        sales: typeof item.metrics === 'object' ? item.metrics.sales || 0 : 0,
        revenue: typeof item.metrics === 'object' ? item.metrics.revenue || 0 : 0,
        roas: typeof item.metrics === 'object' ? item.metrics.roas || 0 : 0
      },
      lastUpdated: new Date(item.updated_at).toLocaleDateString(),
      platforms: item.platforms || [],
      adCopy: item.ad_copy,
      image: item.image,
      insights: item.insights || []
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return getMockProducts();
  }
}

export async function deleteProduct(id: number | string): Promise<boolean> {
  try {
    // We're using soft delete
    const { error } = await supabase
      .from('products')
      .update({ deleted: true })
      .eq('id', id.toString());

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

export async function regenerateAdCopy(id: number | string, productName: string, productDescription: string): Promise<string | null> {
  try {
    const newAdCopy = await generateAdCopy(productName, productDescription);
    
    const { error } = await supabase
      .from('products')
      .update({ ad_copy: newAdCopy, updated_at: new Date().toISOString() })
      .eq('id', id.toString());

    if (error) throw error;
    return newAdCopy;
  } catch (error) {
    console.error('Error regenerating ad copy:', error);
    return null;
  }
}

export async function regenerateProductImage(id: number | string, productName: string, productDescription: string): Promise<string | null> {
  try {
    const newImage = await generateProductImage(productName, productDescription);
    
    const { error } = await supabase
      .from('products')
      .update({ image: newImage, updated_at: new Date().toISOString() })
      .eq('id', id.toString());

    if (error) throw error;
    return newImage;
  } catch (error) {
    console.error('Error regenerating product image:', error);
    return null;
  }
}

// Helper function for mock data when user is not authenticated
function getMockProducts(): Product[] {
  return [
    {
      id: 1,
      name: "Premium Fitness Watch",
      description: "Advanced health tracking features with 7-day battery life",
      status: "Draft",
      metrics: { sales: 0, revenue: 0, roas: 0 },
      lastUpdated: "Just now",
      platforms: ["facebook", "instagram"],
      adCopy: "Track your health journey with precision. Our Premium Fitness Watch offers 24/7 monitoring.",
      image: "/placeholder.svg",
      insights: []
    },
    {
      id: 2,
      name: "Wireless Noise-Cancelling Headphones",
      description: "Premium sound quality with 20-hour battery life",
      status: "Draft",
      metrics: { sales: 0, revenue: 0, roas: 0 },
      lastUpdated: "Just now",
      platforms: ["facebook"],
      adCopy: "Immerse yourself in pure sound with our Wireless Noise-Cancelling Headphones.",
      image: "/placeholder.svg",
      insights: []
    }
  ];
}
