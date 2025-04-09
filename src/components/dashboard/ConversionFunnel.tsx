
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

const weekData = [
  { stage: 'Impressions', value: 28500, fill: '#9b87f5', conversionRate: '100%' },
  { stage: 'Clicks', value: 5320, fill: '#7E69AB', conversionRate: '18.7%' },
  { stage: 'Product Views', value: 3450, fill: '#D6BCFA', conversionRate: '12.1%' },
  { stage: 'Add to Cart', value: 1280, fill: '#38BDF8', conversionRate: '4.5%' },
  { stage: 'Purchases', value: 342, fill: '#10B981', conversionRate: '1.2%' },
];

const monthData = [
  { stage: 'Impressions', value: 124600, fill: '#9b87f5', conversionRate: '100%' },
  { stage: 'Clicks', value: 21450, fill: '#7E69AB', conversionRate: '17.2%' },
  { stage: 'Product Views', value: 14280, fill: '#D6BCFA', conversionRate: '11.5%' },
  { stage: 'Add to Cart', value: 5390, fill: '#38BDF8', conversionRate: '4.3%' },
  { stage: 'Purchases', value: 1468, fill: '#10B981', conversionRate: '1.2%' },
];

// Advanced data with additional conversion details
const detailedWeekData = {
  overall: weekData,
  facebook: [
    { stage: 'Impressions', value: 15600, fill: '#9b87f5', conversionRate: '100%' },
    { stage: 'Clicks', value: 2980, fill: '#7E69AB', conversionRate: '19.1%' },
    { stage: 'Product Views', value: 1850, fill: '#D6BCFA', conversionRate: '11.8%' },
    { stage: 'Add to Cart', value: 720, fill: '#38BDF8', conversionRate: '4.6%' },
    { stage: 'Purchases', value: 182, fill: '#10B981', conversionRate: '1.2%' },
  ],
  instagram: [
    { stage: 'Impressions', value: 12900, fill: '#9b87f5', conversionRate: '100%' },
    { stage: 'Clicks', value: 2340, fill: '#7E69AB', conversionRate: '18.1%' },
    { stage: 'Product Views', value: 1600, fill: '#D6BCFA', conversionRate: '12.4%' },
    { stage: 'Add to Cart', value: 560, fill: '#38BDF8', conversionRate: '4.3%' },
    { stage: 'Purchases', value: 160, fill: '#10B981', conversionRate: '1.2%' },
  ]
};

const detailedMonthData = {
  overall: monthData,
  facebook: [
    { stage: 'Impressions', value: 68200, fill: '#9b87f5', conversionRate: '100%' },
    { stage: 'Clicks', value: 12100, fill: '#7E69AB', conversionRate: '17.7%' },
    { stage: 'Product Views', value: 7900, fill: '#D6BCFA', conversionRate: '11.6%' },
    { stage: 'Add to Cart', value: 2980, fill: '#38BDF8', conversionRate: '4.4%' },
    { stage: 'Purchases', value: 795, fill: '#10B981', conversionRate: '1.2%' },
  ],
  instagram: [
    { stage: 'Impressions', value: 56400, fill: '#9b87f5', conversionRate: '100%' },
    { stage: 'Clicks', value: 9350, fill: '#7E69AB', conversionRate: '16.6%' },
    { stage: 'Product Views', value: 6380, fill: '#D6BCFA', conversionRate: '11.3%' },
    { stage: 'Add to Cart', value: 2410, fill: '#38BDF8', conversionRate: '4.3%' },
    { stage: 'Purchases', value: 673, fill: '#10B981', conversionRate: '1.2%' },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-background border shadow-md">
        <CardContent className="p-3">
          <p className="font-medium">{payload[0].payload.stage}</p>
          <p className="text-sm">Count: <span className="font-medium">{payload[0].value.toLocaleString()}</span></p>
          <p className="text-sm">Conversion Rate: <span className="font-medium">{payload[0].payload.conversionRate}</span></p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export const ConversionFunnel = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [platform, setPlatform] = useState('overall');
  const [view, setView] = useState('funnel');
  
  // Determine which dataset to use based on selections
  const getDataset = () => {
    const timeData = timeframe === 'week' ? detailedWeekData : detailedMonthData;
    return timeData[platform as keyof typeof timeData] || timeData.overall;
  };
  
  const data = getDataset();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs value={view} onValueChange={setView} className="w-[180px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-36 border-chariot-purple/20 h-8">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-36 border-chariot-purple/20 h-8">
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
          <XAxis 
            type="number" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="stage" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            background={{ fill: '#f5f5f5' }}
            radius={[0, 4, 4, 0]}
          >
            {view === 'rates' && (
              <LabelList 
                dataKey="conversionRate" 
                position="right" 
                style={{ fontSize: '10px', fill: 'gray' }} 
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-5 gap-2 mt-4">
        {data.map((stage, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium">{((index === 0 ? 100 : (stage.value / data[0].value) * 100).toFixed(1))}%</div>
            <div className="text-xs text-muted-foreground">{stage.stage}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
        <Info className="h-3 w-3 mr-1" />
        {view === 'funnel' 
          ? 'Funnel shows visitor journey through your sales process' 
          : 'Rates show percentage of visitors at each stage'}
      </div>
    </div>
  );
};
