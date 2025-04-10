
import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/components/products/ProductsData';

// Initialize the Supabase client (these environment variables will be set through Supabase integration)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CreateProductPayload {
  name: string;
  description: string;
  adCopy: string;
  image: string;
  platforms: string[];
  status: string;
}

export async function saveProduct(product: CreateProductPayload): Promise<Product | null> {
  try {
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
