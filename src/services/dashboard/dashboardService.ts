import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth/authService";

export interface DashboardMetrics {
  totalRevenue: number;
  totalBudget: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalProducts: number;
  averageRoas: number;
  conversionCount: number;
  clickThroughRate: number;
  revenueChange: number;
  budgetUtilization: number;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch campaigns data
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id);

    if (campaignsError) throw campaignsError;

    // Fetch products data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false);

    if (productsError) throw productsError;

    // Calculate metrics
    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === 'Active').length || 0;
    const totalProducts = products?.length || 0;
    
    const totalBudget = campaigns?.reduce((sum, campaign) => {
      return sum + (parseFloat(String(campaign.budget)) || 0);
    }, 0) || 0;

    // Calculate revenue from product metrics
    const totalRevenue = products?.reduce((sum, product) => {
      const metrics = product.metrics as any;
      return sum + (metrics?.revenue || 0);
    }, 0) || 0;

    // Calculate average ROAS
    const totalRoas = products?.reduce((sum, product) => {
      const metrics = product.metrics as any;
      return sum + (metrics?.roas || 0);
    }, 0) || 0;
    
    const averageRoas = totalProducts > 0 ? totalRoas / totalProducts : 0;

    // Calculate conversion count
    const conversionCount = products?.reduce((sum, product) => {
      const metrics = product.metrics as any;
      return sum + (metrics?.sales || 0);
    }, 0) || 0;

    // Mock some metrics that would normally come from ad platforms
    const clickThroughRate = 2.8; // Mock CTR
    const revenueChange = 12.5; // Mock revenue change percentage
    const budgetUtilization = totalBudget > 0 ? Math.min((totalRevenue / totalBudget) * 100, 100) : 0;

    return {
      totalRevenue,
      totalBudget,
      totalCampaigns,
      activeCampaigns,
      totalProducts,
      averageRoas,
      conversionCount,
      clickThroughRate,
      revenueChange,
      budgetUtilization
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Return default values on error
    return {
      totalRevenue: 0,
      totalBudget: 0,
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalProducts: 0,
      averageRoas: 0,
      conversionCount: 0,
      clickThroughRate: 0,
      revenueChange: 0,
      budgetUtilization: 0
    };
  }
}

export async function fetchRecentActivity() {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch recent products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(3);

    // Fetch recent campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    return {
      recentProducts: products || [],
      recentCampaigns: campaigns || []
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return {
      recentProducts: [],
      recentCampaigns: []
    };
  }
}