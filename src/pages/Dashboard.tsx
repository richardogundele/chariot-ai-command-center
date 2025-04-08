
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowUp, ArrowDown, HelpCircle, DollarSign, BarChart3, Users, 
  TrendingUp, Info, AlertTriangle, Zap, Plus, RefreshCcw, Clock
} from "lucide-react";
import { CampaignStatus } from "@/components/dashboard/CampaignStatus";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BudgetTracker } from "@/components/dashboard/BudgetTracker";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useToast } from "@/hooks/use-toast";
import { WeeklyProfitChart } from "@/components/reports/WeeklyProfitChart";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ConversionFunnel } from "@/components/dashboard/ConversionFunnel";
import { PlatformBreakdown } from "@/components/dashboard/PlatformBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Dashboard updated",
        description: "Latest campaign data loaded successfully",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold chariot-gradient-text">Campaign Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and campaign performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-primary">Revenue</p>
                <h2 className="text-3xl font-bold">$24,689</h2>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUp className="h-3 w-3 mr-1" />
                12.5%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                <h2 className="text-3xl font-bold">3.2x</h2>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUp className="h-3 w-3 mr-1" />
                0.4x
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <h2 className="text-3xl font-bold">342</h2>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUp className="h-3 w-3 mr-1" />
                18.2%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CTR</p>
                <h2 className="text-3xl font-bold">2.8%</h2>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <BarChart3 className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-red-600 text-sm font-medium">
                <ArrowDown className="h-3 w-3 mr-1" />
                0.5%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Revenue & Conversion Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Weekly Profit</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Revenue, costs and profit this week</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <WeeklyProfitChart />
              </CardContent>
            </Card>
            
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Conversion Funnel</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Visitor journey to conversion</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ConversionFunnel />
              </CardContent>
            </Card>
          </div>

          {/* Campaign Status & Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Campaign Performance</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Platform Breakdown</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Performance across platforms</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <PlatformBreakdown />
              </CardContent>
            </Card>
          </div>

          {/* Budget & Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Budget Utilization</CardTitle>
                <CardDescription>7-day spend across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetTracker />
              </CardContent>
            </Card>

            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md row-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Real-Time Activity</CardTitle>
                <CardDescription>Latest AI actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] overflow-auto">
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader>
                <CardTitle>Advanced Performance Metrics</CardTitle>
                <CardDescription>Detailed analytics of your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Detailed performance metrics would be displayed here</p>
              </CardContent>
            </Card>
            
            <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on investment by campaign</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">ROI analysis would be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="creatives">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Ad creative details would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Audience insights would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
