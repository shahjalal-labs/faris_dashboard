"use client";

import { useUserOverviewQuery } from "@/redux/api/business.Api";
import { useState } from "react";

const UserOverview = () => {
  const [type, setType] = useState("day");
  const { data } = useUserOverviewQuery(type);

  return (
    <div>
      <h1 className="text-xl font-semibold pb-6 text-slate-900 dark:text-slate-100">
        Client Management
      </h1>
      <div className="grid mb-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Total Clients</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalUser || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">New Clients</h1>
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
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Active</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalActive || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
          <h1 className="text-gray-600 dark:text-slate-400">Blocked</h1>
          <p className="text-xl font-bold pt-3 text-slate-900 dark:text-slate-100">
            {data?.result?.totalBlocked || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
