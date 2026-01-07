import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricCard } from "@/types/dashboard";
import { ArrowUp, ArrowDown } from "lucide-react";

export function Metric({
  title,
  value,
  change,
  timeFrame,
  icon: Icon,
  iconColor,
}: MetricCard & {
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}) {
  const isPositive = change > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs">
          {isPositive ? (
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              "font-medium",
              isPositive ? "text-green-500" : "text-red-500",
            )}
          >
            {Math.abs(change)}%
          </span>
          <span className="ml-1 text-muted-foreground">than {timeFrame}</span>
        </div>
      </CardContent>
    </Card>
  );
}
