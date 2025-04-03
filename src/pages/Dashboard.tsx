
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowUp, ArrowDown, HelpCircle, DollarSign, BarChart3, Users, TrendingUp, Info, AlertTriangle } from "lucide-react";
import { CampaignStatus } from "@/components/dashboard/CampaignStatus";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BudgetTracker } from "@/components/dashboard/BudgetTracker";
import { AlertCard } from "@/components/dashboard/AlertCard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and campaign performance</p>
        </div>
        <Button>Create New Campaign</Button>
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
            <CampaignStatus />
            
            <Card className="col-span-2">
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Spend" 
              value="$3,245.50" 
              change={12.5} 
              changeType="increase"
              icon={DollarSign}
            />
            <MetricCard 
              title="Conversions" 
              value="342" 
              change={8.2} 
              changeType="increase"
              icon={TrendingUp}
            />
            <MetricCard 
              title="CTR" 
              value="2.8%" 
              change={-0.5} 
              changeType="decrease"
              icon={BarChart3}
            />
            <MetricCard 
              title="Audience Reach" 
              value="42.5K" 
              change={15.3} 
              changeType="increase"
              icon={Users}
            />
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
