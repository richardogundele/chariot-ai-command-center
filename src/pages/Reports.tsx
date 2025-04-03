
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WeeklyProfitChart } from "@/components/reports/WeeklyProfitChart";
import { InsightCard } from "@/components/reports/InsightCard";
import { 
  TrendingUp, FileText, Target, Activity, Zap, 
  BarChart, DollarSign, Users
} from "lucide-react";

const Reports = () => {
  return (
    <DashboardLayout className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Insights</h1>
          <p className="text-muted-foreground">Performance analytics and AI-driven recommendations</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Weekly Performance Summary</CardTitle>
          <CardDescription>April 1 - April 7, 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-medium">This Week:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm">Total Spend</div>
                  <div className="text-2xl font-bold">$5,400</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm">Revenue</div>
                  <div className="text-2xl font-bold">$16,200</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm">ROAS</div>
                  <div className="text-2xl font-bold">3.0x</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm">Conversions</div>
                  <div className="text-2xl font-bold">217</div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18% improvement vs last week</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your campaign optimizations are paying off with steady performance gains
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <WeeklyProfitChart />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">
              View Previous Reports
            </Button>
            <Button>
              Reinvest Profits
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              icon={Zap}
              title="Platform Performance"
              description="Google Ads outperformed Facebook by 34% in conversion rate. Consider reallocating 15% of your Facebook budget to Google."
              action="Adjust Budget"
            />
            
            <InsightCard
              icon={Target}
              title="Audience Discovery"
              description="A new demographic segment (Women, 25-34) is showing 2.3x higher engagement than other groups."
              action="Target Segment"
            />
            
            <InsightCard
              icon={Activity}
              title="Creative Optimization"
              description="Ad variations with product demonstrations achieved 28% higher CTR than static images."
              action="Update Creatives"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="channels">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Marketing Channel Performance</CardTitle>
              <CardDescription>Breakdown by platform over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="font-medium">Platform</div>
                  <div className="flex space-x-8">
                    <div className="w-24 text-right">Spend</div>
                    <div className="w-24 text-right">ROAS</div>
                    <div className="w-24 text-right">Conversions</div>
                  </div>
                </div>
                
                {/* Platform rows */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Google Ads</span>
                  </div>
                  <div className="flex space-x-8">
                    <div className="w-24 text-right">$2,450</div>
                    <div className="w-24 text-right text-green-600">3.8x</div>
                    <div className="w-24 text-right">127</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    <span>Facebook</span>
                  </div>
                  <div className="flex space-x-8">
                    <div className="w-24 text-right">$1,850</div>
                    <div className="w-24 text-right text-green-600">2.4x</div>
                    <div className="w-24 text-right">73</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-pink-500" />
                    <span>Instagram</span>
                  </div>
                  <div className="flex space-x-8">
                    <div className="w-24 text-right">$1,100</div>
                    <div className="w-24 text-right text-green-600">2.9x</div>
                    <div className="w-24 text-right">42</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <div className="text-muted-foreground flex flex-col items-center">
              <DollarSign className="h-10 w-10 mb-2 opacity-20" />
              <p>Audience analytics will be displayed here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
