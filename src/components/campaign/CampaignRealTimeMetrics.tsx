
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { useRealtime } from '@/hooks/useRealtimeExample';
import { Loader2, RefreshCw } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  timestamp: string;
}

interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  convRate: number;
  cpc: number;
  spend: number;
  revenue: number;
  roas: number;
}

interface TimeSeriesData {
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export const CampaignRealTimeMetrics = ({ campaignId }: { campaignId: string }) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const { toast } = useToast();

  // Use our realtime hook to get live updates
  const { isConnected } = useRealtime({
    endpoint: '/ws/campaign',
    queryKey: ['campaign', campaignId],
    onMessage: (data) => {
      if (data.type === 'metrics_update') {
        setMetrics(prev => ({ ...prev!, ...data.metrics }));
        
        // Add new time series datapoint if it's a time series update
        if (data.timeSeriesPoint) {
          setTimeSeriesData(prev => [...prev, data.timeSeriesPoint]);
        }
      } else if (data.type === 'new_lead') {
        // Add new lead to the list
        setRecentLeads(prev => [data.lead, ...prev].slice(0, 10));
        
        toast({
          title: "New Lead!",
          description: `${data.lead.name} just converted via ${data.lead.source}`,
        });
      }
    },
    onConnect: () => {
      toast({
        title: "Real-time connection established",
        description: "You'll now receive live campaign updates",
      });
    },
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be fetched from an API
        // For this example, we'll use mock data
        setTimeout(() => {
          // Mock initial metrics
          setMetrics({
            impressions: 12458,
            clicks: 842,
            conversions: 68,
            ctr: 6.76,
            convRate: 8.08,
            cpc: 0.86,
            spend: 725.12,
            revenue: 2860.45,
            roas: 3.94
          });
          
          // Mock time series data
          const mockTimeSeriesData = Array.from({ length: 24 }, (_, i) => {
            const date = new Date();
            date.setHours(date.getHours() - (24 - i));
            
            return {
              timestamp: date.toISOString(),
              impressions: 400 + Math.floor(Math.random() * 300),
              clicks: 25 + Math.floor(Math.random() * 20),
              conversions: 1 + Math.floor(Math.random() * 5),
              spend: 25 + Math.random() * 15,
              revenue: 80 + Math.random() * 60
            };
          });
          setTimeSeriesData(mockTimeSeriesData);
          
          // Mock recent leads
          const mockLeads = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setMinutes(date.getMinutes() - i * 12);
            
            return {
              id: `lead-${i}`,
              name: `John Doe ${i+1}`,
              email: `lead${i+1}@example.com`,
              source: ['Facebook', 'Instagram', 'Google', 'Direct'][Math.floor(Math.random() * 4)],
              timestamp: date.toISOString()
            };
          });
          setRecentLeads(mockLeads);
          
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error loading campaign metrics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load campaign metrics',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [campaignId, toast]);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="relative">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Real-time metrics and analytics</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading campaign metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <div className={`absolute right-4 top-4 rounded-full p-1 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}>
        <div className={`animate-pulse h-2 w-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-amber-300'}`} />
      </div>
      
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>Real-time metrics and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads ({recentLeads.length})</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 font-semibold text-sm mb-1">Impressions</div>
                <div className="text-2xl font-bold">{metrics?.impressions.toLocaleString()}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 font-semibold text-sm mb-1">Clicks</div>
                <div className="text-2xl font-bold">{metrics?.clicks.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 font-semibold text-sm mb-1">Conversions</div>
                <div className="text-2xl font-bold">{metrics?.conversions.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Engagement Metrics</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData.slice(-12)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTimestamp}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [value, '']}
                        labelFormatter={(label) => formatTimestamp(label)}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#8884d8" 
                        name="Clicks"
                        strokeWidth={2} 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="conversions" 
                        stroke="#82ca9d" 
                        name="Conversions"
                        strokeWidth={2} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Revenue vs. Spend</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData.slice(-12)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTimestamp}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`$${value}`, '']}
                        labelFormatter={(label) => formatTimestamp(label)}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        fill="#8884d8" 
                        stroke="#8884d8"
                        fillOpacity={0.3}
                        name="Revenue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="spend" 
                        fill="#82ca9d" 
                        stroke="#82ca9d"
                        fillOpacity={0.3}
                        name="Spend"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Source</th>
                      <th className="text-left p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="border-t">
                        <td className="p-3 font-medium">{lead.name}</td>
                        <td className="p-3">{lead.email}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                            ${lead.source === 'Facebook' ? 'bg-blue-100 text-blue-800' :
                              lead.source === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                              lead.source === 'Google' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(lead.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                    {recentLeads.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No leads recorded yet. Leads will appear here in real-time as they come in.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Lead Source Breakdown</h4>
                </div>
                <div className="h-[200px]">
                  {recentLeads.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Facebook', value: recentLeads.filter(l => l.source === 'Facebook').length },
                            { name: 'Instagram', value: recentLeads.filter(l => l.source === 'Instagram').length },
                            { name: 'Google', value: recentLeads.filter(l => l.source === 'Google').length },
                            { name: 'Direct', value: recentLeads.filter(l => l.source === 'Direct').length },
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Facebook', value: recentLeads.filter(l => l.source === 'Facebook').length },
                            { name: 'Instagram', value: recentLeads.filter(l => l.source === 'Instagram').length },
                            { name: 'Google', value: recentLeads.filter(l => l.source === 'Google').length },
                            { name: 'Direct', value: recentLeads.filter(l => l.source === 'Direct').length },
                          ].filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No lead source data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">CTR</div>
                  <div className="text-xl font-semibold">{metrics?.ctr.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-xl font-semibold">{metrics?.convRate.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">CPC</div>
                  <div className="text-xl font-semibold">${metrics?.cpc.toFixed(2)}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">ROAS</div>
                  <div className="text-xl font-semibold">{metrics?.roas.toFixed(2)}x</div>
                </div>
              </div>
              
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Hourly Performance Breakdown</h4>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData.slice(-12)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTimestamp} 
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (name === 'impressions') return [value.toLocaleString(), 'Impressions'];
                          if (name === 'clicks') return [value.toLocaleString(), 'Clicks'];
                          if (name === 'conversions') return [value.toLocaleString(), 'Conversions'];
                          return [value, name];
                        }}
                        labelFormatter={(label) => formatTimestamp(label)}
                      />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                      <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                      <Bar dataKey="conversions" fill="#ffc658" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="text-center py-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Data updates in real-time
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
