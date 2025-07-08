import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'red' | 'gray' | 'green';
}

const colorClasses = {
  blue: 'bg-dashboard-blue text-white',
  red: 'bg-dashboard-red text-white', 
  gray: 'bg-dashboard-gray text-white',
  green: 'bg-dashboard-success text-white'
};

export function KpiCard({ title, value, icon: Icon, trend, color }: KpiCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-dashboard-success' : 'text-dashboard-red'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}