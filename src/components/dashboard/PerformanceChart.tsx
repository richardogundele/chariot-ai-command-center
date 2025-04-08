
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { date: 'April 1', ctr: 2.4, cpc: 0.65, cpm: 7.3, roas: 2.8 },
  { date: 'April 2', ctr: 2.6, cpc: 0.62, cpm: 7.1, roas: 3.0 },
  { date: 'April 3', ctr: 2.2, cpc: 0.67, cpm: 7.5, roas: 2.7 },
  { date: 'April 4', ctr: 2.8, cpc: 0.61, cpm: 6.9, roas: 3.1 },
  { date: 'April 5', ctr: 3.1, cpc: 0.58, cpm: 6.7, roas: 3.4 },
  { date: 'April 6', ctr: 2.9, cpc: 0.60, cpm: 6.8, roas: 3.2 },
  { date: 'April 7', ctr: 2.7, cpc: 0.63, cpm: 7.0, roas: 3.0 },
  { date: 'April 8', ctr: 2.5, cpc: 0.64, cpm: 7.2, roas: 2.9 },
];

export const PerformanceChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          domain={[0, 4]}
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            border: '1px solid #eee', 
            padding: '8px 12px' 
          }} 
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{
            paddingTop: '10px',
            fontSize: '12px'
          }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          name="CTR (%)"
          dataKey="ctr" 
          stroke="#9b87f5" 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          name="CPC ($)" 
          dataKey="cpc" 
          stroke="#38BDF8" 
          strokeWidth={2} 
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          name="CPM ($)" 
          dataKey="cpm" 
          stroke="#FB923C" 
          strokeWidth={2} 
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          name="ROAS (x)" 
          dataKey="roas" 
          stroke="#10B981" 
          strokeWidth={2} 
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
