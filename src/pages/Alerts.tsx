
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, HelpCircle, Search, DollarSign, Check, X, AlertTriangle } from "lucide-react";
import { Alert } from "@/components/alerts/Alert";

const Alerts = () => {
  return (
    <DashboardLayout headerActions={(<Button variant="outline" size="sm" className="font-medium">Filter</Button>)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Intervention</h1>
          <p className="text-muted-foreground">Review and respond to AI-generated alerts</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="pl-9 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-[250px]"
              placeholder="Search alerts..."
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Alerts</span>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="px-3 py-2 bg-red-500/10 rounded-md text-center">
                      <div className="text-sm font-medium text-red-600">3</div>
                      <div className="text-xs text-muted-foreground">Urgent</div>
                    </div>
                    
                    <div className="px-3 py-2 bg-yellow-500/10 rounded-md text-center">
                      <div className="text-sm font-medium text-yellow-600">2</div>
                      <div className="text-xs text-muted-foreground">Warning</div>
                    </div>
                    
                    <div className="px-3 py-2 bg-green-500/10 rounded-md text-center">
                      <div className="text-sm font-medium text-green-600">3</div>
                      <div className="text-xs text-muted-foreground">Opportunity</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">About Alerts</CardTitle>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The ChariotAI system continuously monitors your campaigns and generates alerts when it detects issues or opportunities. Alerts are categorized by urgency level and require your input to proceed with suggested actions.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Action Required</CardTitle>
              <CardDescription>Alerts that need your immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Alert
                icon={DollarSign}
                title="Performance is strong! Increase budget?"
                description="Facebook ad set 'Product Showcase' is performing 38% above target ROAS. AI recommends increasing budget by 25% to capture more conversions."
                urgency="opportunity"
                timestamp="15 minutes ago"
                buttons={[
                  { label: "Approve", variant: "default", icon: Check },
                  { label: "Decline", variant: "outline", icon: X },
                  { label: "Modify", variant: "ghost", icon: null }
                ]}
              />
              
              <Alert
                icon={AlertTriangle}
                title="Compliance Check Needed"
                description="New ad creative contains health claims that may violate Facebook's advertising policies. Human review required before publishing."
                urgency="warning"
                timestamp="1 hour ago"
                buttons={[
                  { label: "Review", variant: "default", icon: null },
                  { label: "Dismiss", variant: "outline", icon: X },
                ]}
              />
              
              <Alert
                icon={AlertCircle}
                title="Budget Limit Approaching"
                description="Campaign 'Summer Collection' will reach its budget limit in approximately 2 days at current spend rate. Consider increasing the budget to maintain momentum."
                urgency="urgent"
                timestamp="3 hours ago"
                buttons={[
                  { label: "Increase Budget", variant: "default", icon: null },
                  { label: "Keep Current Limit", variant: "outline", icon: null },
                ]}
              />
              
              <Alert
                icon={TrendingUp}
                title="New Audience Opportunity"
                description="AI analysis suggests a new audience segment 'Tech Enthusiasts, 25-34' could yield 22% higher conversions based on recent performance data."
                urgency="opportunity"
                timestamp="Yesterday"
                buttons={[
                  { label: "Create Test Campaign", variant: "default", icon: null },
                  { label: "Save for Later", variant: "outline", icon: null },
                  { label: "Ignore", variant: "ghost", icon: X }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="urgent">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Urgent alerts would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="opportunities">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Opportunity alerts would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="warnings">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border border-border">
            <p className="text-muted-foreground">Warning alerts would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Alerts;
