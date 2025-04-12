
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth/authService";
import { CreateProductPayload, Product } from "./types";
import { generateAdCopy, generateProductImage } from "./aiGenerationService";
import { getMockProducts } from "./mockProductData";

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
      const metrics = data.metrics as { sales: number; revenue: number; roas: number } | null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        metrics: {
          sales: metrics?.sales ?? 0,
          revenue: metrics?.revenue ?? 0,
          roas: metrics?.roas ?? 0
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

    return (data || []).map((item: any) => {
      const metrics = item.metrics as { sales: number; revenue: number; roas: number } | null;
      
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
        metrics: {
          sales: metrics?.sales ?? 0,
          revenue: metrics?.revenue ?? 0,
          roas: metrics?.roas ?? 0
        },
        lastUpdated: new Date(item.updated_at).toLocaleDateString(),
        platforms: item.platforms || [],
        adCopy: item.ad_copy,
        image: item.image,
        insights: item.insights || []
      };
    });
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
