"use client";

import { useBusinessOverviewQuery } from "@/redux/api/business.Api";
import { useState } from "react";

const BusinessOverview = () => {
  const [type, setType] = useState("day");
  const { data } = useBusinessOverviewQuery(type);

  return (
    <div>
      <h1 className="text-xl font-semibold pb-6 text-slate-900 dark:text-slate-100">
        Business Management
      </h1>
      <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Total Business</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalBusiness || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Active</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalActive || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Pending</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalPending || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Not Verified</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalPending || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Verified</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalBusiness - data?.result?.totalPending || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">New Business</h1>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
              {data?.result?.totalNew || 0}
            </p>
            <select
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-[6px] p-1"
              name=""
              id=""
              onChange={(e) => setType(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview;
