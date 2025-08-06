
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowUp, ArrowDown, HelpCircle, DollarSign, BarChart3, Users, 
  TrendingUp, Info, AlertTriangle, Zap, Plus, RefreshCcw, Clock, Activity, Target
} from "lucide-react";
import { CampaignStatus } from "@/components/dashboard/CampaignStatus";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BudgetTracker } from "@/components/dashboard/BudgetTracker";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useToast } from "@/hooks/use-toast";
import { WeeklyProfitChart } from "@/components/reports/WeeklyProfitChart";
import { fetchDashboardMetrics, DashboardMetrics } from "@/services/dashboard/dashboardService";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ConversionFunnel } from "@/components/dashboard/ConversionFunnel";
import { PlatformBreakdown } from "@/components/dashboard/PlatformBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardMetrics = await fetchDashboardMetrics();
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      toast({
        title: "Dashboard updated",
        description: "Latest campaign data loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleRefresh} 
        disabled={refreshing} 
        className="bg-background border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
        size="sm"
      >
        {refreshing ? (
          <RefreshCcw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <Button 
        onClick={handleAddProduct} 
        className="shadow-lg"
        size="sm"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <DashboardLayout headerActions={headerActions}>
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold chariot-gradient-text flex items-center gap-3">
            <Activity className="h-7 w-7 sm:h-8 sm:w-8 text-chariot-purple" />
            <span className="leading-tight">Campaign Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">Real-time insights and performance analytics</p>
        </div>
      </div>

      {/* Enhanced KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8" role="region" aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key Performance Metrics</h2>
        
        <Card className="metric-card overflow-hidden group hover:shadow-xl transition-all duration-300" role="article" aria-labelledby="revenue-metric">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2" id="revenue-metric">Total Revenue</p>
                <h2 className="text-3xl font-bold text-foreground leading-none" aria-describedby="revenue-metric">
                  {loading ? (
                    <div className="h-9 bg-muted animate-pulse rounded-md w-24" aria-label="Loading revenue data"></div>
                  ) : (
                    <span aria-label={`Total revenue: ${metrics?.totalRevenue ? `$${metrics.totalRevenue.toLocaleString()}` : "$0"}`}>
                      ${metrics?.totalRevenue.toLocaleString() || "0"}
                    </span>
                  )}
                </h2>
              </div>
              <div className="glow-effect" aria-hidden="true">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full" aria-label={`Revenue increased by ${metrics?.revenueChange?.toFixed(1) || "0"}% compared to last month`}>
                <ArrowUp className="h-3 w-3 mr-1" aria-hidden="true" />
                {loading ? "..." : `${metrics?.revenueChange.toFixed(1) || "0"}%`}
              </div>
              <span className="text-xs text-muted-foreground" aria-hidden="true">vs. last month</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" aria-hidden="true"></div>
          </CardContent>
        </Card>

        <Card className="metric-card overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">ROAS</p>
                <h2 className="text-3xl font-bold text-foreground leading-none">
                  {loading ? (
                    <div className="h-9 bg-muted animate-pulse rounded-md w-16"></div>
                  ) : (
                    `${metrics?.averageRoas.toFixed(1) || "0.0"}x`
                  )}
                </h2>
              </div>
              <div className="glow-effect">
                <div className="p-3 bg-gradient-to-br from-chariot-purple to-chariot-accent rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                <ArrowUp className="h-3 w-3 mr-1" />
                0.4x
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-chariot-purple to-chariot-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </CardContent>
        </Card>

        <Card className="metric-card overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">Conversions</p>
                <h2 className="text-3xl font-bold text-foreground leading-none">
                  {loading ? (
                    <div className="h-9 bg-muted animate-pulse rounded-md w-12"></div>
                  ) : (
                    `${metrics?.conversionCount || "0"}`
                  )}
                </h2>
              </div>
              <div className="glow-effect">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                <ArrowUp className="h-3 w-3 mr-1" />
                18.2%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </CardContent>
        </Card>

        <Card className="metric-card overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">Click-Through Rate</p>
                <h2 className="text-3xl font-bold text-foreground leading-none">
                  {loading ? (
                    <div className="h-9 bg-muted animate-pulse rounded-md w-16"></div>
                  ) : (
                    `${metrics?.clickThroughRate.toFixed(1) || "0.0"}%`
                  )}
                </h2>
              </div>
              <div className="glow-effect">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-red-600 text-sm font-semibold bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full">
                <ArrowDown className="h-3 w-3 mr-1" />
                0.5%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab} role="tablist" aria-label="Dashboard views">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg"
            role="tab"
            aria-controls="overview-panel"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg"
            role="tab"
            aria-controls="performance-panel"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="audience" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg"
            role="tab"
            aria-controls="audience-panel"
          >
            Audience
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="overview" 
          className="space-y-8 mt-8" 
          role="tabpanel" 
          id="overview-panel"
          aria-labelledby="overview-tab"
        >
          {/* Revenue & Conversion Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-xl">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-chariot-purple" />
                    Weekly Profit
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">Revenue, costs and profit analysis for the current week</p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <CardDescription>Revenue, costs and profit this week</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded w-1/3"></div>
                    <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
                  </div>
                ) : (
                  <WeeklyProfitChart />
                )}
              </CardContent>
            </Card>
            
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-xl">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-chariot-accent" />
                    Conversion Funnel
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">Track visitor journey from awareness to conversion</p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <CardDescription>Visitor journey to conversion</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
                    <div className="space-y-3">
                      <div className="h-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-6 bg-muted animate-pulse rounded w-4/5"></div>
                      <div className="h-5 bg-muted animate-pulse rounded w-3/5"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-2/5"></div>
                    </div>
                  </div>
                ) : (
                  <ConversionFunnel />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Status & Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-xl">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Campaign Performance
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded w-2/5"></div>
                    <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
                  </div>
                ) : (
                  <PerformanceChart />
                )}
              </CardContent>
            </Card>
            
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-xl">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Platform Breakdown
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardTitle>
                <CardDescription>Performance across platforms</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded w-3/5"></div>
                    <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
                  </div>
                ) : (
                  <PlatformBreakdown />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Budget & Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Budget Utilization
                </CardTitle>
                <CardDescription>7-day spend across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetTracker />
              </CardContent>
            </Card>

            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 row-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Real-Time Activity
                </CardTitle>
                <CardDescription>Latest AI actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] overflow-auto">
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="performance" 
          className="space-y-8 mt-8" 
          role="tabpanel" 
          id="performance-panel"
          aria-labelledby="performance-tab"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-chariot-purple" />
                  Advanced Performance Metrics
                </CardTitle>
                <CardDescription>Detailed analytics of your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Detailed performance metrics would be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="neo-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  ROI Analysis
                </CardTitle>
                <CardDescription>Return on investment by campaign</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ROI analysis would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="audience" 
          className="space-y-8 mt-8" 
          role="tabpanel" 
          id="audience-panel"
          aria-labelledby="audience-tab"
        >
          <Card className="neo-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Audience Analytics
              </CardTitle>
              <CardDescription>Understand who your customers are</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 border border-gray-200/50 rounded-xl bg-gradient-to-br from-white to-gray-50/50">
                <CardTitle className="text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-chariot-purple" />
                  Demographics
                </CardTitle>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Age Distribution</div>
                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-chariot-purple to-chariot-accent h-full w-[35%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>18-24: 35%</span>
                      <span>25-34: 42%</span>
                      <span>35+: 23%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Gender</div>
                    <div className="flex rounded-full overflow-hidden h-3">
                      <div className="bg-blue-500 w-[45%]"></div>
                      <div className="bg-pink-500 w-[55%]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Male: 45%</span>
                      <span>Female: 55%</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border border-gray-200/50 rounded-xl bg-gradient-to-br from-white to-gray-50/50">
                <CardTitle className="text-lg mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-chariot-accent" />
                  Top Locations
                </CardTitle>
                <div className="space-y-4">
                  {[
                    { city: 'New York', percentage: 85 },
                    { city: 'Los Angeles', percentage: 65 },
                    { city: 'Chicago', percentage: 45 }
                  ].map((location) => (
                    <div key={location.city} className="flex justify-between items-center">
                      <span className="font-medium">{location.city}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-100 h-2 rounded-full">
                          <div 
                            className="bg-gradient-to-r from-chariot-purple to-chariot-accent h-full rounded-full transition-all duration-500"
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
