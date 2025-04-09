import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, Settings, HelpCircle, BarChart3, Users, 
  MessageCircle, TrendingUp, ArrowUpRight, ArrowDownRight, CalendarDays 
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import CampaignDialog from "@/components/products/CampaignDialog";

const performanceData = [
  { day: 'Mon', clicks: 45, impressions: 1200, conversions: 5 },
  { day: 'Tue', clicks: 52, impressions: 1350, conversions: 7 },
  { day: 'Wed', clicks: 49, impressions: 1280, conversions: 6 },
  { day: 'Thu', clicks: 63, impressions: 1500, conversions: 9 },
  { day: 'Fri', clicks: 59, impressions: 1420, conversions: 8 },
  { day: 'Sat', clicks: 48, impressions: 1100, conversions: 5 },
  { day: 'Sun', clicks: 42, impressions: 980, conversions: 4 },
];

const platformData = [
  { name: 'Facebook', value: 45 },
  { name: 'Instagram', value: 30 },
  { name: 'Google', value: 25 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const mockCampaigns = [
  {
    id: 1,
    name: "Premium Fitness Watch Campaign",
    product: "Premium Fitness Watch",
    status: "Active",
    budget: "$250/day",
    platforms: ["Facebook", "Instagram", "Google"],
    performance: {
      roas: "3.2x",
      ctr: "3.8%",
      conversions: 142,
      spend: "$1,245.80"
    }
  },
  {
    id: 2,
    name: "Wireless Headphones Promo",
    product: "Wireless Noise-Cancelling Headphones",
    status: "Paused",
    budget: "$150/day",
    platforms: ["Facebook", "Google"],
    performance: {
      roas: "2.8x",
      ctr: "2.1%",
      conversions: 87,
      spend: "$985.25"
    }
  },
  {
    id: 3,
    name: "Security Camera Launch",
    product: "Smart Home Security Camera",
    status: "Draft",
    budget: "$0/day",
    platforms: [],
    performance: {
      roas: "0",
      ctr: "0%",
      conversions: 0,
      spend: "$0"
    }
  },
];

const Campaign = () => {
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">Manage and track all your product campaigns</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Last 7 days
          </Button>
          <Button className="gap-2" onClick={() => setCampaignDialogOpen(true)}>
            <Play className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      {/* Campaign Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <h2 className="text-3xl font-bold">3</h2>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Play className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                2
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                <h2 className="text-3xl font-bold">$3,245</h2>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
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
                <p className="text-sm font-medium text-muted-foreground">Avg. ROAS</p>
                <h2 className="text-3xl font-bold">3.2x</h2>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
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
                <h2 className="text-3xl font-bold">235</h2>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Users className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-red-600 text-sm font-medium">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3.2%
              </div>
              <span className="text-xs text-muted-foreground">vs. last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* List of Campaigns */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Campaigns</CardTitle>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <CardDescription>Manage your active and paused campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map(campaign => (
              <div 
                key={campaign.id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => console.log(`View campaign ${campaign.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">Product: {campaign.product}</div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    campaign.status === "Active" ? "bg-green-500/10 text-green-600" :
                    campaign.status === "Paused" ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-gray-500/10 text-gray-600"
                  }`}>
                    {campaign.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Budget</div>
                    <div className="text-sm font-medium">{campaign.budget}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">ROAS</div>
                    <div className="text-sm font-medium">{campaign.performance.roas}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">CTR</div>
                    <div className="text-sm font-medium">{campaign.performance.ctr}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Conversions</div>
                    <div className="text-sm font-medium">{campaign.performance.conversions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Spend</div>
                    <div className="text-sm font-medium">{campaign.performance.spend}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    {campaign.platforms.map(platform => (
                      <span 
                        key={platform} 
                        className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium text-primary"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={campaign.status === "Active" ? "" : "hidden"}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={campaign.status === "Paused" ? "" : "hidden"}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Performance Trends</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Weekly click and impression trends</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="impressions" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Platform Distribution</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Ad spend by platform</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Weekly conversion rate and total conversions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance Details</CardTitle>
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
              <CardDescription>Detailed performance metrics across campaigns</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" />
                  <Bar dataKey="impressions" fill="#82ca9d" />
                  <Bar dataKey="conversions" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>How campaigns are performing across different platforms</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Platform-specific data visualization would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Demographics and behavior analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Audience data visualization would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CampaignDialog 
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Campaign;
