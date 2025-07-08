import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlatformDistributionChartProps {
  data: { platform: string; count: number; percentage: number }[];
}

const COLORS = {
  AIRBNB: 'hsl(var(--dashboard-red))',
  BOOKING: 'hsl(var(--dashboard-blue))',
  UNKNOWN: 'hsl(var(--dashboard-gray))'
};

export function PlatformDistributionChart({ data }: PlatformDistributionChartProps) {
  const chartData = data.map(item => ({
    name: item.platform,
    value: item.count,
    percentage: item.percentage
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">Reservas por Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.UNKNOWN} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} reservas`, name]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}