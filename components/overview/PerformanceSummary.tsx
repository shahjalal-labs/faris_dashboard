"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useBusinessPerformanceSummaryQuery } from "@/redux/api/business.Api";

type ChartType = "daily" | "weekly" | "monthly" | "yearly";

const PerformanceSummary = () => {
  const [type, setType] = useState<ChartType>("monthly");

  const { data: summary, isLoading } = useBusinessPerformanceSummaryQuery(type);

  const chartData = summary?.result?.chartData || [];

  const getDataKey = () => {
    switch (type) {
      case "daily":
        return "day";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      case "yearly":
        return "year";
      default:
        return "month";
    }
  };

  // totals for legend
  const totalCompleted = chartData.reduce(
    (acc: number, item: any) => acc + (item.completed || 0),
    0,
  );

  const totalCancelled = chartData.reduce(
    (acc: number, item: any) => acc + (item.cancelled || 0),
    0,
  );

  return (
    <Card className="p-3 my-6 w-full rounded-2xl shadow-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl leading-none font-medium text-[#191b3a] dark:text-slate-100">
            Performance Summary
          </h2>

          <div className="w-40 hidden sm:block">
            <Select
              value={type}
              onValueChange={(value) => setType(value as ChartType)}
            >
              <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[275px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-500">
              Loading...
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-500">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -18, bottom: 20 }}
              >
                <CartesianGrid
                  stroke="#d9dce6"
                  strokeDasharray="0"
                  vertical={false}
                />

                <XAxis
                  dataKey={getDataKey()}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 16, fill: "#636986", fontWeight: 600 }}
                  dy={12}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={0}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />

                {/* Completed */}
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                {/* Cancelled */}
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#f35b67"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex justify-center gap-8 mt-4 pt-6 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Completed{" "}
              <span className="font-bold text-[#10b981]">
                ({totalCompleted})
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f35b67]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Cancelled{" "}
              <span className="font-bold text-[#f35b67]">
                ({totalCancelled})
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceSummary;
