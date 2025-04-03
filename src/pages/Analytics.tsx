
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart, LineChart, PieChart } from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock data for charts
const lineData = [
  { name: 'Mon', sales: 12, clicks: 320, impressions: 4000 },
  { name: 'Tue', sales: 19, clicks: 450, impressions: 5100 },
  { name: 'Wed', sales: 15, clicks: 280, impressions: 3500 },
  { name: 'Thu', sales: 27, clicks: 390, impressions: 4800 },
  { name: 'Fri', sales: 32, clicks: 480, impressions: 5300 },
  { name: 'Sat', sales: 24, clicks: 390, impressions: 4200 },
  { name: 'Sun', sales: 18, clicks: 310, impressions: 3800 },
];

const platformData = [
  { name: 'Facebook', value: 45 },
  { name: 'Instagram', value: 35 },
  { name: 'Google', value: 20 },
];

const conversionData = [
  { name: 'Add to Cart', count: 320 },
  { name: 'Checkout', count: 180 },
  { name: 'Purchase', count: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [chartType, setChartType] = useState("line");

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View detailed performance metrics</p>
        </div>
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button 
              variant={chartType === "line" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-r-none"
              onClick={() => setChartType("line")}
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button 
              variant={chartType === "bar" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-none border-x border-border"
              onClick={() => setChartType("bar")}
            >
              <BarChart className="h-4 w-4" />
            </Button>
            <Button 
              variant={chartType === "area" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-l-none"
              onClick={() => setChartType("area")}
            >
              <AreaChart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Track your key metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <Tabs defaultValue="sales">
                <TabsList className="mb-4">
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="clicks">Clicks</TabsTrigger>
                  <TabsTrigger value="impressions">Impressions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <RechartsBarChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#8884d8" />
                      </RechartsBarChart>
                    ) : (
                      <RechartsAreaChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3} 
                        />
                      </RechartsAreaChart>
                    )}
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="clicks" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#82ca9d" 
                          activeDot={{ r: 8 }} 
                        />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <RechartsBarChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#82ca9d" />
                      </RechartsBarChart>
                    ) : (
                      <RechartsAreaChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          fillOpacity={0.3} 
                        />
                      </RechartsAreaChart>
                    )}
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="impressions" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="impressions" 
                          stroke="#ffc658" 
                          activeDot={{ r: 8 }} 
                        />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <RechartsBarChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="impressions" fill="#ffc658" />
                      </RechartsBarChart>
                    ) : (
                      <RechartsAreaChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="impressions" 
                          stroke="#ffc658" 
                          fill="#ffc658" 
                          fillOpacity={0.3} 
                        />
                      </RechartsAreaChart>
                    )}
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Revenue share by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Tracking user journey to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
