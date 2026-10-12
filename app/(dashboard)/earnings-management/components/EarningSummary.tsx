"use client";

import { useBusinessEarningsSummaryQuery } from "@/redux/api/business.Api";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartType = "daily" | "weekly" | "monthly" | "yearly";

const EarningSummary = ({ title }: any) => {
  const [type, setType] = useState<ChartType>("monthly");
  const { data: summary } = useBusinessEarningsSummaryQuery(type);

  const chartData = summary?.result?.chartData || [];

  console.log(chartData);

  const getDataKey = () => {
    switch (type) {
      case "weekly":
        return "week";
      case "daily":
        return "day";
      case "monthly":
        return "month";
      case "yearly":
        return "year";
      default:
        return "week";
    }
  };

  return (
    <Card className="p-6 my-6 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
      <div className="space-y-6">
        {/* Period Selection Dropdown */}
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <div className="w-48">
            <Select
              value={type}
              onValueChange={(value) => setType(value as ChartType)}
            >
              <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={getDataKey()} tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(value) => `${value}`}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar dataKey="earnings" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EarningSummary;
