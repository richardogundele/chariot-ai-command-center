
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', revenue: 2250, cost: 750, profit: 1500 },
  { day: 'Tue', revenue: 2400, cost: 800, profit: 1600 },
  { day: 'Wed', revenue: 2100, cost: 700, profit: 1400 },
  { day: 'Thu', revenue: 2700, cost: 900, profit: 1800 },
  { day: 'Fri', revenue: 3000, cost: 1000, profit: 2000 },
  { day: 'Sat', revenue: 2500, cost: 850, profit: 1650 },
  { day: 'Sun', revenue: 1200, cost: 400, profit: 800 },
];

export const WeeklyProfitChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, '']}
          labelStyle={{ fontSize: 14, fontWeight: 500, color: '#111' }}
          contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee', padding: '8px 12px' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
        />
        <Bar 
          name="Revenue" 
          dataKey="revenue" 
          fill="#9b87f5" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          name="Costs" 
          dataKey="cost" 
          fill="#b6a4f9" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          name="Profit" 
          dataKey="profit" 
          fill="#38BDF8" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
