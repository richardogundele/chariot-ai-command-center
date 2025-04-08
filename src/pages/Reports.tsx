
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
    <DashboardLayout className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">View your campaign performance and insights</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="channels">Channel Data</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Weekly Performance</CardTitle>
              <CardDescription>April 1 - April 7, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 border border-purple-100/50">
                      <div className="text-muted-foreground text-sm">Total Spend</div>
                      <div className="text-2xl font-bold">$5,400</div>
                    </Card>
                    <Card className="p-4 border border-purple-100/50">
                      <div className="text-muted-foreground text-sm">Revenue</div>
                      <div className="text-2xl font-bold">$16,200</div>
                    </Card>
                    <Card className="p-4 border border-purple-100/50">
                      <div className="text-muted-foreground text-sm">ROAS</div>
                      <div className="text-2xl font-bold">3.0x</div>
                    </Card>
                    <Card className="p-4 border border-purple-100/50">
                      <div className="text-muted-foreground text-sm">Conversions</div>
                      <div className="text-2xl font-bold">217</div>
                    </Card>
                  </div>
                  
                  <Card className="p-4 border-green-100 bg-green-50/50">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <TrendingUp className="h-4 w-4" />
                      <span>18% improvement vs last week</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your campaign optimizations are paying off with steady performance gains
                    </p>
                  </Card>
                </div>
                
                <div className="flex-1">
                  <Card className="h-full border p-4">
                    <WeeklyProfitChart />
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              icon={Zap}
              title="Platform Performance"
              description="Google Ads outperformed Facebook by 34% in conversion rate. Consider reallocating 15% of your budget to Google."
              action="Adjust Budget"
            />
            
            <InsightCard
              icon={Target}
              title="Audience Discovery"
              description="Women, 25-34 years old, are showing 2.3x higher engagement than other groups."
              action="Target Segment"
            />
            
            <InsightCard
              icon={Activity}
              title="Creative Optimization"
              description="Product demonstrations achieved 28% higher CTR than static images."
              action="Update Creatives"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="channels">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Marketing Channel Performance</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
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
                <Card className="p-3">
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
                </Card>
                
                <Card className="p-3">
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
                </Card>
                
                <Card className="p-3">
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
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Analytics</CardTitle>
              <CardDescription>Understand who your customers are</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 border">
                <CardTitle className="text-lg mb-2">Demographics</CardTitle>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Age Distribution</div>
                    <div className="bg-gray-100 h-6 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[35%]" style={{ width: "35%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>18-24: 35%</span>
                      <span>25-34: 42%</span>
                      <span>35+: 23%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Gender</div>
                    <div className="flex">
                      <div className="bg-blue-400 h-6 rounded-l-full w-[45%]" style={{ width: "45%" }}></div>
                      <div className="bg-pink-400 h-6 rounded-r-full w-[55%]" style={{ width: "55%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Male: 45%</span>
                      <span>Female: 55%</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border">
                <CardTitle className="text-lg mb-2">Top Locations</CardTitle>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>New York</span>
                    <div className="flex items-center">
                      <div className="w-36 bg-gray-100 h-2 rounded-full mr-2">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Los Angeles</span>
                    <div className="flex items-center">
                      <div className="w-36 bg-gray-100 h-2 rounded-full mr-2">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Chicago</span>
                    <div className="flex items-center">
                      <div className="w-36 bg-gray-100 h-2 rounded-full mr-2">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
