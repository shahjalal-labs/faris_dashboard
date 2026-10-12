"use client";

import { useMemo, useState } from "react";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type ChartRange = "daily" | "weekly" | "monthly";

type CompletedClientLike = {
  date?: string;
  price?: number | string;
};

type Props = {
  clients: CompletedClientLike[];
};

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#1CAF8F",
  },
} satisfies ChartConfig;

function getSafeDate(value?: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSafePrice(value?: number | string): number {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function getChartData(range: ChartRange, clients: CompletedClientLike[]) {
  const now = new Date();

  if (range === "daily") {
    return Array.from({ length: 7 }).map((_, index) => {
      const day = subDays(now, 6 - index);
      const start = startOfDay(day);
      const end = endOfDay(day);

      const earnings = clients.reduce((sum, item) => {
        const date = getSafeDate(item.date);
        if (!date || !isWithinInterval(date, { start, end })) {
          return sum;
        }
        return sum + getSafePrice(item.price);
      }, 0);

      return {
        label: format(day, "EEE"),
        earnings,
      };
    });
  }

  if (range === "weekly") {
    return Array.from({ length: 8 }).map((_, index) => {
      const weekStart = startOfWeek(subWeeks(now, 7 - index), {
        weekStartsOn: 1,
      });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      const earnings = clients.reduce((sum, item) => {
        const date = getSafeDate(item.date);
        if (
          !date ||
          !isWithinInterval(date, { start: weekStart, end: weekEnd })
        ) {
          return sum;
        }
        return sum + getSafePrice(item.price);
      }, 0);

      return {
        label: format(weekStart, "dd MMM"),
        earnings,
      };
    });
  }

  return Array.from({ length: 6 }).map((_, index) => {
    const monthStart = startOfMonth(subMonths(now, 5 - index));
    const monthEnd = endOfMonth(monthStart);

    const earnings = clients.reduce((sum, item) => {
      const date = getSafeDate(item.date);
      if (
        !date ||
        !isWithinInterval(date, { start: monthStart, end: monthEnd })
      ) {
        return sum;
      }
      return sum + getSafePrice(item.price);
    }, 0);

    return {
      label: format(monthStart, "MMM"),
      earnings,
    };
  });
}

const CompletedClientsOverviewChart = ({ clients }: Props) => {
  const [range, setRange] = useState<ChartRange>("weekly");

  const chartData = useMemo(
    () => getChartData(range, clients),
    [range, clients],
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-semibold">
          Overview
        </h2>

        <div className="w-32">
          <Select
            value={range}
            onValueChange={(value) => setRange(value as ChartRange)}
          >
            <SelectTrigger className="h-9 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChartContainer className="h-[280px] w-full" config={chartConfig}>
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis tickLine={false} axisLine={false} width={44} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => [
                  Number(value).toLocaleString("en-US"),
                  "Earnings",
                ]}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="var(--color-earnings)"
            strokeWidth={3}
            dot={{ r: 3, fill: "var(--color-earnings)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default CompletedClientsOverviewChart;
