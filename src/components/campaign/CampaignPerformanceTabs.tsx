import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle, CalendarDays } from "lucide-react";
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

interface CampaignPerformanceTabsProps {
  campaignId: string;
  conversions?: number;
  cpa?: number;
  roas?: number;
}

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

export const CampaignPerformanceTabs: React.FC<CampaignPerformanceTabsProps> = ({
  campaignId,
  conversions = 0,
  cpa = 0,
  roas = 0
}) => {
  // Format metrics for display
  const formattedCpa = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(cpa);
  
  const formattedRoas = `${roas.toFixed(1)}x`;

  return (
    <Tabs defaultValue="overview" className="mb-8">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="platforms">Platforms</TabsTrigger>
        <TabsTrigger value="audience">Audience</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Campaign Performance</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Campaign ID: {campaignId.substring(0, 8)}...</span>
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
            <CardDescription>Key performance metrics for your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Conversions</div>
                <div className="text-2xl font-bold">{conversions}</div>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">CPA</div>
                <div className="text-2xl font-bold">{formattedCpa}</div>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">ROAS</div>
                <div className="text-2xl font-bold">{formattedRoas}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
  );
};
