"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type MonthlyEarning = {
  month: string;
  earnings: number;
};

export function MonthlyEarnings({
  chartData,
  setType,
}: {
  chartData: MonthlyEarning[];
  setType: any;
}) {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-slate-900 dark:text-slate-100">
          Platform Earning Report
        </CardTitle>
        <select
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-200 dark:border-slate-700 px-4 py-1 text-gray-600 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-[6px]"
          name=""
          id=""
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-[380px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
