
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Settings, HelpCircle, BarChart3, Image, Users, MessageCircle } from "lucide-react";

const Campaign = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Campaign</h1>
          <p className="text-muted-foreground">Managing your active campaigns</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Pause className="h-4 w-4" />
            Pause Campaign
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Campaign Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="font-medium">Active</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Running for 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">$250<span className="text-sm font-normal text-muted-foreground">/day</span></div>
            <p className="text-sm text-muted-foreground mt-1">Monthly: $7,500</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium text-primary">Facebook</div>
              <div className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium text-primary">Instagram</div>
              <div className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium text-primary">Google</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">3.2x <span className="text-sm font-normal text-muted-foreground">ROAS</span></div>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-green-600">Above Target</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="mb-8">
        <TabsList>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="creatives" className="gap-2">
            <Image className="h-4 w-4" />
            Creatives
          </TabsTrigger>
          <TabsTrigger value="audience" className="gap-2">
            <Users className="h-4 w-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="ai-decisions" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Decisions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance by Platform</CardTitle>
                  <CardDescription>How your campaign is performing across different channels</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Facebook</h3>
                    <div className="px-2 py-1 bg-green-500/10 rounded-md text-xs font-medium text-green-600">High Performance</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Spend</div>
                      <div className="font-medium">$1,245.80</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">ROAS</div>
                      <div className="font-medium">4.2x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                      <div className="font-medium">3.8%</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <Button variant="link" className="h-auto p-0 text-sm">Why is this performing well?</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Instagram</h3>
                    <div className="px-2 py-1 bg-yellow-500/10 rounded-md text-xs font-medium text-yellow-600">Average Performance</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Spend</div>
                      <div className="font-medium">$985.25</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">ROAS</div>
                      <div className="font-medium">2.8x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                      <div className="font-medium">2.1%</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <Button variant="link" className="h-auto p-0 text-sm">How can we improve this?</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Google Search</h3>
                    <div className="px-2 py-1 bg-green-500/10 rounded-md text-xs font-medium text-green-600">High Performance</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Spend</div>
                      <div className="font-medium">$1,014.45</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">ROAS</div>
                      <div className="font-medium">3.5x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                      <div className="font-medium">4.2%</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <Button variant="link" className="h-auto p-0 text-sm">View detailed metrics</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creatives">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Creative assets would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Audience data would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-decisions">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">AI decision log would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Campaign;
