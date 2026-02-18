"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; 

const chartConfig = {
  count: {
    label: "Launches",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function LocationLaunchesChart({ data }: { data: object[] }) {

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="site"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="count" 
          fill="var(--color-count)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ChartContainer>
  );
}