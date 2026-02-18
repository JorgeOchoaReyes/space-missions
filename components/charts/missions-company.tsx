"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; 

const chartConfig = {
  count: {
    label: "Total Missions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CompanyMissionsChart({ data }: { data: object[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"  
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="company"
          type="category"
          tickLine={false}
          axisLine={false}
          width={150}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="count" 
          fill="var(--color-count)" 
          radius={4} 
        />
      </BarChart>
    </ChartContainer>
  );
}