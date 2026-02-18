"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; 

const chartConfig = {
  SuccessRate: {
    label: "Success Rate (%)",
    color: "black",
  },
} satisfies ChartConfig;

export function SuccessRateChart({ data }: { data: object[] }) { 
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-autos">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false}  />
        <XAxis
          dataKey="Year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          unit="%" 
          domain={[0, 100]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="SuccessRate"
          type="monotone"
          stroke="var(--color-SuccessRate)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>  
    </ChartContainer>
  );
}