import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth/authService";

export interface BusinessInsight {
  type: 'success' | 'warning' | 'opportunity' | 'action_needed';
  title: string;
  description: string;
  impact: string; // What this means for their money
  recommendation?: string;
  confidence: number; // 0-100
}

export interface CashflowSummary {
  moneyIn: number;
  moneyOut: number;
  profit: number;
  profitMargin: number;
  plainEnglishSummary: string;
  recommendation: string;
  nextAction: string;
}

export interface PerformanceRecommendation {
  action: 'increase_budget' | 'pause_campaign' | 'scale_winner' | 'optimize_creative' | 'change_audience';
  reason: string;
  expectedOutcome: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  priority: number; // 1-5, 5 being highest
}

// Convert technical metrics to business language
export function translateMetricsToBusiness(metrics: any): CashflowSummary {
  const moneyIn = metrics.totalRevenue || 0;
  const moneyOut = metrics.totalBudget || 0;
  const profit = moneyIn - moneyOut;
  const profitMargin = moneyOut > 0 ? (profit / moneyOut) * 100 : 0;
  
  // Generate plain English summary
  let plainEnglishSummary = "";
  let recommendation = "";
  let nextAction = "";
  
  if (moneyOut === 0) {
    plainEnglishSummary = "You haven't started spending on ads yet.";
    recommendation = "Time to launch your first campaign and start generating results!";
    nextAction = "Create your first campaign";
  } else if (profit > 0) {
    const roas = moneyIn / moneyOut;
    plainEnglishSummary = `You spent £${moneyOut.toFixed(0)} and earned £${moneyIn.toFixed(0)}. That's ${roas.toFixed(1)}x return on every pound spent.`;
    
    if (roas > 3) {
      recommendation = `Excellent! You're making £${roas.toFixed(1)} for every £1 spent. This is profitable - consider increasing your budget.`;
      nextAction = `Scale successful campaigns by 20-30%`;
    } else if (roas > 2) {
      recommendation = `Good results! You're profitable but there's room to improve. Focus on optimizing your best-performing ads.`;
      nextAction = `Optimize top campaigns for better performance`;
    } else {
      recommendation = `You're making money but margins are tight. Focus on improving conversion rates before scaling.`;
      nextAction = `Test new ad copy and audiences`;
    }
  } else {
    plainEnglishSummary = `You spent £${moneyOut.toFixed(0)} but only earned £${moneyIn.toFixed(0)}. You're currently losing £${Math.abs(profit).toFixed(0)}.`;
    recommendation = `Don't panic - this is normal when starting. Focus on finding what works before spending more.`;
    nextAction = `Pause losing campaigns and test new approaches`;
  }
  
  return {
    moneyIn,
    moneyOut,
    profit,
    profitMargin,
    plainEnglishSummary,
    recommendation,
    nextAction
  };
}

// Generate business insights from campaign data
export function generateBusinessInsights(campaigns: any[], products: any[]): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  
  // Check for profitable campaigns
  const profitableCampaigns = campaigns.filter(c => {
    const revenue = c.meta_data?.revenue || 0;
    const spend = c.budget || 0;
    return revenue > spend * 1.5; // 1.5x ROAS threshold
  });
  
  if (profitableCampaigns.length > 0) {
    insights.push({
      type: 'success',
      title: `${profitableCampaigns.length} Profitable Campaign${profitableCampaigns.length > 1 ? 's' : ''}`,
      description: `These campaigns are making money consistently`,
      impact: `Generating positive cashflow`,
      recommendation: `Scale these winners by increasing budget 20-30%`,
      confidence: 90
    });
  }
  
  // Check for underperforming campaigns
  const underperformingCampaigns = campaigns.filter(c => {
    const revenue = c.meta_data?.revenue || 0;
    const spend = c.budget || 0;
    return spend > 0 && revenue < spend * 0.8; // Less than 0.8x ROAS
  });
  
  if (underperformingCampaigns.length > 0) {
    const wastedSpend = underperformingCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    insights.push({
      type: 'warning',
      title: `${underperformingCampaigns.length} Campaign${underperformingCampaigns.length > 1 ? 's' : ''} Losing Money`,
      description: `These campaigns are spending more than they're earning`,
      impact: `Wasting £${wastedSpend.toFixed(0)} that could be used elsewhere`,
      recommendation: `Pause these campaigns and test new audiences or creative`,
      confidence: 85
    });
  }
  
  // Check for products without campaigns
  const productsWithoutCampaigns = products.filter(p => 
    !campaigns.some(c => c.product_id === p.id)
  );
  
  if (productsWithoutCampaigns.length > 0) {
    insights.push({
      type: 'opportunity',
      title: `${productsWithoutCampaigns.length} Product${productsWithoutCampaigns.length > 1 ? 's' : ''} Not Advertised`,
      description: `You have products that could be generating revenue`,
      impact: `Potential untapped income streams`,
      recommendation: `Create campaigns for these products to maximize revenue`,
      confidence: 75
    });
  }
  
  // Check for budget optimization opportunities
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.meta_data?.revenue || 0), 0);
  
  if (totalBudget > 0 && totalRevenue > totalBudget * 2) {
    insights.push({
      type: 'opportunity',
      title: 'Budget Scaling Opportunity',
      description: `Your campaigns are performing well - you could spend more profitably`,
      impact: `Could potentially double your current profit`,
      recommendation: `Gradually increase budget on top performers`,
      confidence: 80
    });
  }
  
  return insights;
}

// Generate specific performance recommendations
export function generatePerformanceRecommendations(
  campaigns: any[],
  historicalData?: any[]
): PerformanceRecommendation[] {
  const recommendations: PerformanceRecommendation[] = [];
  
  campaigns.forEach(campaign => {
    const revenue = campaign.meta_data?.revenue || 0;
    const spend = campaign.budget || 0;
    const roas = spend > 0 ? revenue / spend : 0;
    
    if (roas > 3) {
      recommendations.push({
        action: 'increase_budget',
        reason: `Campaign "${campaign.name}" is generating £${roas.toFixed(1)} for every £1 spent`,
        expectedOutcome: `Could generate £${(spend * 0.3 * roas).toFixed(0)} additional profit with 30% budget increase`,
        riskLevel: 'low',
        timeframe: '1-2 weeks',
        priority: 5
      });
    } else if (roas < 1) {
      recommendations.push({
        action: 'pause_campaign',
        reason: `Campaign "${campaign.name}" is losing money - only generating £${roas.toFixed(2)} per £1 spent`,
        expectedOutcome: `Save £${spend.toFixed(0)} per month by pausing and redirecting budget`,
        riskLevel: 'low',
        timeframe: 'Immediate',
        priority: 4
      });
    } else if (roas > 1.5 && roas < 2.5) {
      recommendations.push({
        action: 'optimize_creative',
        reason: `Campaign "${campaign.name}" is profitable but has room for improvement`,
        expectedOutcome: `Could improve ROAS from ${roas.toFixed(1)}x to 3x+ with better creative`,
        riskLevel: 'medium',
        timeframe: '2-3 weeks',
        priority: 3
      });
    }
  });
  
  // Sort by priority
  return recommendations.sort((a, b) => b.priority - a.priority);
}

// Create milestone tracking for user motivation
export interface BusinessMilestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  achieved: boolean;
  celebrationMessage?: string;
  nextMilestone?: string;
}

export function generateMilestones(
  totalRevenue: number,
  totalProfit: number,
  campaignCount: number
): BusinessMilestone[] {
  const milestones: BusinessMilestone[] = [
    {
      id: 'first_campaign',
      title: 'First Campaign Launched',
      description: 'Get your first ad campaign live',
      target: 1,
      current: campaignCount,
      achieved: campaignCount >= 1,
      celebrationMessage: '🎉 Congratulations! Your first campaign is live and working for you.',
      nextMilestone: 'First £100 in revenue'
    },
    {
      id: 'first_100_revenue',
      title: 'First £100 Revenue',
      description: 'Generate your first £100 from ads',
      target: 100,
      current: totalRevenue,
      achieved: totalRevenue >= 100,
      celebrationMessage: '💰 Amazing! You\'ve generated your first £100. This is just the beginning.',
      nextMilestone: 'Break-even point'
    },
    {
      id: 'break_even',
      title: 'Break-Even Point',
      description: 'Make back what you\'ve spent on ads',
      target: 0,
      current: totalProfit,
      achieved: totalProfit >= 0,
      celebrationMessage: '📈 Fantastic! You\'re now profitable. Every pound from here is pure profit.',
      nextMilestone: 'First £1,000 profit'
    },
    {
      id: 'first_1000_profit',
      title: 'First £1,000 Profit',
      description: 'Generate £1,000 in pure profit',
      target: 1000,
      current: totalProfit,
      achieved: totalProfit >= 1000,
      celebrationMessage: '🚀 Incredible! £1,000 in profit shows you\'ve built something scalable.',
      nextMilestone: 'Consistent profitability'
    },
    {
      id: 'consistent_profit',
      title: 'Consistent Profitability',
      description: 'Maintain 3x+ ROAS for 30 days',
      target: 3,
      current: totalRevenue > 0 ? totalRevenue / Math.max(totalRevenue - totalProfit, 1) : 0,
      achieved: false, // Would need historical data to determine
      celebrationMessage: '🏆 You\'ve mastered profitable advertising! Time to scale big.',
      nextMilestone: '£10,000 monthly profit'
    }
  ];
  
  return milestones;
}

// Main service function that combines everything
export async function getBusinessResults(): Promise<{
  cashflowSummary: CashflowSummary;
  insights: BusinessInsight[];
  recommendations: PerformanceRecommendation[];
  milestones: BusinessMilestone[];
}> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch campaigns and products
    const [campaignsResult, productsResult] = await Promise.all([
      supabase.from('campaigns').select('*').eq('user_id', user.id),
      supabase.from('products').select('*').eq('user_id', user.id).eq('deleted', false)
    ]);

    const campaigns = campaignsResult.data || [];
    const products = productsResult.data || [];

    // Calculate basic metrics
    const totalRevenue = products.reduce((sum, p) => sum + ((p.metrics as any)?.revenue || 0), 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const totalProfit = totalRevenue - totalBudget;

    // Generate business-focused results
    const cashflowSummary = translateMetricsToBusiness({ totalRevenue, totalBudget });
    const insights = generateBusinessInsights(campaigns, products);
    const recommendations = generatePerformanceRecommendations(campaigns);
    const milestones = generateMilestones(totalRevenue, totalProfit, campaigns.length);

    return {
      cashflowSummary,
      insights,
      recommendations,
      milestones
    };

  } catch (error) {
    console.error('Error generating business results:', error);
    
    // Return default values
    return {
      cashflowSummary: {
        moneyIn: 0,
        moneyOut: 0,
        profit: 0,
        profitMargin: 0,
        plainEnglishSummary: "Ready to start making money with your ads?",
        recommendation: "Let's create your first campaign and get you profitable!",
        nextAction: "Add your first product"
      },
      insights: [],
      recommendations: [],
      milestones: generateMilestones(0, 0, 0)
    };
  }
}