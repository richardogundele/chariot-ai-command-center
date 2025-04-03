
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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`$${value}`, '']}
          labelStyle={{ color: 'black' }}
          contentStyle={{ backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <Legend />
        <Bar name="Revenue" dataKey="revenue" fill="#38BDF8" radius={[4, 4, 0, 0]} />
        <Bar name="Costs" dataKey="cost" fill="#1E293B" radius={[4, 4, 0, 0]} />
        <Bar name="Profit" dataKey="profit" fill="#06B6D4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
