
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowUp, ArrowDown, DollarSign, ShoppingCart, Users, PercentSquare } from "lucide-react";
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
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Revenue data - area chart
const revenueData = monthNames.map((month, index) => {
  // Generate a smoothly increasing line with some randomness
  const baseValue = 30000 + index * 8000 + Math.random() * 15000;
  return {
    name: month,
    value: Math.round(baseValue)
  };
});

// Conversions data - bar chart
const conversionsData = monthNames.map((month, index) => {
  // Start with lower values and gradually increase
  const baseValue = 100 + index * 45 + Math.random() * 50;
  return {
    name: month,
    value: Math.round(baseValue)
  };
});

// Campaign performance data - horizontal bar chart
const campaignData = [
  { name: "Summer Product Launch", value: 75 },
  { name: "Black Friday Special", value: 45 },
  { name: "Holiday Bundle", value: 90 },
  { name: "Spring Collection", value: 82 },
  { name: "Back to School", value: 60 }
];

// Platform distribution data - pie chart
const platformData = [
  { name: "Facebook", value: 45 },
  { name: "Instagram", value: 32 },
  { name: "TikTok", value: 18 },
  { name: "Other", value: 5 },
];

const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#38BDF8'];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <DashboardLayout headerLeftText="View your campaign performance and insight">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold chariot-gradient-text">Analytics</h1>
          <p className="text-muted-foreground">Track your campaign performance and identify opportunities</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] border-chariot-purple/20">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2 border-chariot-purple/20 hover:bg-chariot-purple/10">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">$125,692.32</h3>
                <DollarSign className="h-5 w-5 text-chariot-purple" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 flex items-center font-medium mr-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  18.2%
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Conversions</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">1,856</h3>
                <ShoppingCart className="h-5 w-5 text-chariot-purple" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 flex items-center font-medium mr-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5%
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Leads</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">5,243</h3>
                <Users className="h-5 w-5 text-chariot-purple" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 flex items-center font-medium mr-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  9.1%
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Average ROI</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">287%</h3>
                <PercentSquare className="h-5 w-5 text-chariot-purple" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-red-600 flex items-center font-medium mr-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  2.3%
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </div>
            <Select defaultValue="yearToDate">
              <SelectTrigger className="w-[160px] border-chariot-purple/20">
                <SelectValue placeholder="This Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearToDate">This Year</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => `$${value/1000}K`}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5000', 'dataMax + 10000']}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9b87f5" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Conversions</CardTitle>
              <CardDescription>Monthly conversion count</CardDescription>
            </div>
            <Select defaultValue="yearToDate">
              <SelectTrigger className="w-[160px] border-chariot-purple/20">
                <SelectValue placeholder="This Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearToDate">This Year</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={conversionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()}`, "Conversions"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Performance metrics by campaign</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={campaignData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Performance"]}
                />
                <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-chariot-purple/20 hover:border-chariot-purple/40 transition-colors shadow-sm hover:shadow-md">
          <CardHeader>
            <CardTitle>Platforms Breakdown</CardTitle>
            <CardDescription>Revenue distribution by platform</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Share"]}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value, entry, index) => (
                    <span className="text-sm">{value} <span className="font-semibold">{platformData[index].value}%</span></span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
