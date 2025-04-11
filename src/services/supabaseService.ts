
import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/components/products/ProductsData';

// Initialize the Supabase client with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a client if credentials are available
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface CreateProductPayload {
  name: string;
  description: string;
  adCopy: string;
  image: string;
  platforms: string[];
  status: string;
}

// Authentication functions
export async function signUp(email: string, password: string): Promise<{ user: any; error: any }> {
  if (!supabase) {
    console.warn('Supabase is not configured. Unable to sign up.');
    return { user: null, error: new Error('Supabase is not configured') };
  }
  
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
  if (!supabase) {
    console.warn('Supabase is not configured. Using mock authentication.');
    
    // Simulate authentication for development
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      return { 
        user: { email }, 
        error: null 
      };
    }
    
    return { 
      user: null, 
      error: new Error('Invalid credentials') 
    };
  }
  
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
  
  if (!supabase) {
    return { error: null };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<{ user: any; error: any }> {
  if (!supabase) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return { 
      user: isAuthenticated ? { email: localStorage.getItem("userName") || "User" } : null, 
      error: null 
    };
  }
  
  const { data, error } = await supabase.auth.getUser();
  return { 
    user: data?.user || null, 
    error 
  };
}

export async function saveProduct(product: CreateProductPayload): Promise<Product | null> {
  try {
    // If Supabase isn't configured, return a mock product
    if (!supabase) {
      console.warn('Supabase is not configured. Using mock data instead.');
      return {
        id: Math.floor(Math.random() * 1000),
        name: product.name,
        description: product.description,
        status: 'Draft',
        metrics: {
          sales: 0,
          revenue: 0,
          roas: 0
        },
        lastUpdated: 'Just now',
        platforms: product.platforms,
        adCopy: product.adCopy,
        image: product.image,
        insights: []
      };
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        status: 'Draft',
        metrics: {
          sales: 0,
          revenue: 0,
          roas: 0
        },
        last_updated: new Date().toISOString(),
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
        metrics: data.metrics,
        lastUpdated: 'Just now',
        platforms: data.platforms,
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
    // If Supabase isn't configured, return mock data
    if (!supabase) {
      console.warn('Supabase is not configured. Using mock data instead.');
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

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      status: item.status,
      metrics: item.metrics || { sales: 0, revenue: 0, roas: 0 },
      lastUpdated: new Date(item.last_updated).toLocaleDateString(),
      platforms: item.platforms || [],
      adCopy: item.ad_copy,
      image: item.image,
      insights: item.insights || []
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
