"use client";

import { useDashboardOverviewQuery } from "@/redux/api/business.Api";
import BusinessEarnings from "./components/BusinessEarnings";
import EarningSummary from "./components/EarningSummary";
import { Loader2, SaudiRiyal } from "lucide-react";

const EarningsPage = () => {
  const { data: users, isLoading } = useDashboardOverviewQuery("");

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex rounded-2xl flex-col items-center py-4">
        <h1 className="text-slate-700 dark:text-slate-300">Total Earnings</h1>
        <p className="text-5xl font-sold pt-3 text-slate-900 dark:text-slate-100">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <SaudiRiyal size={50}/>
              <p>{users?.result?.totalEarnings}</p>
            </div>
          )}
        </p>
      </div>
      <EarningSummary title="Total Earnings"></EarningSummary>
      <BusinessEarnings></BusinessEarnings>
    </div>
  );
};

export default EarningsPage;
