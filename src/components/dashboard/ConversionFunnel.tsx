
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const weekData = [
  { stage: 'Impressions', value: 28500, fill: '#9b87f5' },
  { stage: 'Clicks', value: 5320, fill: '#7E69AB' },
  { stage: 'Product Views', value: 3450, fill: '#D6BCFA' },
  { stage: 'Add to Cart', value: 1280, fill: '#38BDF8' },
  { stage: 'Purchases', value: 342, fill: '#10B981' },
];

const monthData = [
  { stage: 'Impressions', value: 124600, fill: '#9b87f5' },
  { stage: 'Clicks', value: 21450, fill: '#7E69AB' },
  { stage: 'Product Views', value: 14280, fill: '#D6BCFA' },
  { stage: 'Add to Cart', value: 5390, fill: '#38BDF8' },
  { stage: 'Purchases', value: 1468, fill: '#10B981' },
];

export const ConversionFunnel = () => {
  const [timeframe, setTimeframe] = useState('week');
  const data = timeframe === 'week' ? weekData : monthData;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-36 border-chariot-purple/20">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
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
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()}`, '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: '1px solid #eee', 
              padding: '8px 12px' 
            }}
          />
          <Bar 
            dataKey="value" 
            background={{ fill: '#f5f5f5' }}
            radius={[0, 4, 4, 0]}
          />
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
    </div>
  );
};
