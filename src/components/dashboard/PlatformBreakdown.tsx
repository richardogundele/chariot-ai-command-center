
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const revenueData = [
  { name: 'Facebook', value: 12560, color: '#9b87f5' },
  { name: 'Instagram', value: 8940, color: '#7E69AB' },
  { name: 'Google', value: 6780, color: '#D6BCFA' },
  { name: 'TikTok', value: 4300, color: '#38BDF8' },
  { name: 'YouTube', value: 2450, color: '#FB923C' },
];

const impressionData = [
  { name: 'Facebook', value: 124000, color: '#9b87f5' },
  { name: 'Instagram', value: 98600, color: '#7E69AB' },
  { name: 'Google', value: 45800, color: '#D6BCFA' },
  { name: 'TikTok', value: 86400, color: '#38BDF8' },
  { name: 'YouTube', value: 32100, color: '#FB923C' },
];

const clickData = [
  { name: 'Facebook', value: 5840, color: '#9b87f5' },
  { name: 'Instagram', value: 4260, color: '#7E69AB' },
  { name: 'Google', value: 3540, color: '#D6BCFA' },
  { name: 'TikTok', value: 2780, color: '#38BDF8' },
  { name: 'YouTube', value: 1430, color: '#FB923C' },
];

export const PlatformBreakdown = () => {
  const [metric, setMetric] = useState('revenue');
  
  const getDataByMetric = () => {
    switch(metric) {
      case 'revenue': return revenueData;
      case 'impressions': return impressionData;
      case 'clicks': return clickData;
      default: return revenueData;
    }
  };

  const data = getDataByMetric();
  
  const formatValue = (value: number) => {
    if (metric === 'revenue') {
      return `$${value.toLocaleString()}`;
    } else if (metric === 'impressions' || metric === 'clicks') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-36 border-chariot-purple/20">
            <SelectValue placeholder="Revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="impressions">Impressions</SelectItem>
            <SelectItem value="clicks">Clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [formatValue(value as number), '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #eee', 
                padding: '8px 12px' 
              }}
            />
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                paddingLeft: 20,
                fontSize: '12px'
              }}
              formatter={(value, entry, index) => {
                // Calculate percentage of total
                const total = data.reduce((sum, item) => sum + item.value, 0);
                const percentage = ((data[index].value / total) * 100).toFixed(1);
                return <span style={{ color: '#333' }}>{value} ({percentage}%)</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
