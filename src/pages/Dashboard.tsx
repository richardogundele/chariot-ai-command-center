
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
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

        <Card>
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

        <Card>
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

        <Card>
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

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Monthly Goal</CardTitle>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">About Monthly Goals</h4>
                          <p className="text-sm text-muted-foreground">
                            This shows your progress toward your monthly revenue target.
                            The AI automatically adjusts campaigns to help reach this goal.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <CardDescription>Progress to $30,000 target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">$24,689 of $30,000</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    
                    <div className="flex items-center justify-between pt-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">7 days remaining</span>
                      </div>
                      <div className="text-green-600 font-medium">On track</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <CampaignStatus />
            </div>
            
            <Card className="row-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Real-Time Activity</CardTitle>
                <CardDescription>Latest AI actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] overflow-auto">
                <ActivityFeed />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Budget Utilization</CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">About Budget Utilization</h4>
                        <p className="text-sm text-muted-foreground">
                          This shows how effectively your budget is being used across different platforms.
                          The AI optimizes spend based on performance.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <CardDescription>7-day spend across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetTracker />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Insights</CardTitle>
                <CardDescription>Latest observations and suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-md bg-primary/5 border border-primary/10">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Facebook ad outperformed Instagram by 22%</p>
                    <p className="text-xs text-muted-foreground mt-1">The CTR on Facebook is significantly higher, suggesting your audience is more engaged there.</p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Rebalance Budget</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-md bg-primary/5 border border-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">ROAS has increased to 3.2x</p>
                    <p className="text-xs text-muted-foreground mt-1">Your return on ad spend is above target. Consider scaling budget to capture more conversions.</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" className="h-7 text-xs">Scale Budget</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">Learn More</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-md bg-primary/5 border border-primary/10">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">New audience segment discovered</p>
                    <p className="text-xs text-muted-foreground mt-1">Women 25-34 in urban areas are responding well to your ads with a 4.1x ROAS.</p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Create Targeted Campaign</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Human Intervention Required</CardTitle>
                <CardDescription>Issues that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertCard 
                  icon={AlertTriangle} 
                  title="Compliance Check Needed" 
                  description="New ad creative might not comply with Google's healthcare policies."
                  urgency="medium"
                />
                
                <AlertCard 
                  icon={DollarSign} 
                  title="Budget Limit Approaching" 
                  description="Campaign will reach budget limit in approximately 2 days."
                  urgency="high"
                />
                
                <AlertCard 
                  icon={Users} 
                  title="Audience Fatigue Detected" 
                  description="Core audience showing signs of ad fatigue. New creatives recommended."
                  urgency="low"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Performance metrics details would be displayed here</p>
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
