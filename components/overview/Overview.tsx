"use client";

import EarningSummary from "@/app/(dashboard)/earnings-management/components/EarningSummary";
import { useDashboardOverviewQuery } from "@/redux/api/business.Api";
import { User, Wallet } from "lucide-react";
import Link from "next/link";
import { CiHardDrive } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";
import TopSellingServices from "./TopSellingServices";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MostRequested from "@/app/(dashboard)/insights/components/MostRequested";
import PerformanceSummary from "./PerformanceSummary";
import RecentActivities from "./RecentActivities";
import AllRecentActivities from "./AllBookings";
import AllMostRequested from "./AllTopSelling";

const Overview = () => {
  const [active, setActive] = useState("view");
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (searchParams.get("view") === "home") {
      setActive("view");
    }
  }, [searchKey]);
  const { data: summary } = useDashboardOverviewQuery("yearly");

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     window.location.reload();
  //   }, 50000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <>
      {active === "view" && (
        <div className="w-full py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Link
              href="/service-management"
              className={`flex justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 items-center px-6 py-8 rounded-2xl cursor-pointer`}
            >
              <div>
                <h1 className="text-gray-500 dark:text-slate-400">
                  Total Services
                </h1>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {summary?.result?.totalServices || 0}
                </p>
              </div>
              <div className="bg-[#0D834A]/10 rounded-[7px] text-[#0D834A] p-2">
                <CiHardDrive size={17} />
              </div>
            </Link>
            <Link
              href="/client-management"
              className={`flex justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 items-center px-6 py-8 rounded-2xl cursor-pointer`}
            >
              <div>
                <h1 className="text-gray-500 dark:text-slate-400">
                  Total Clients
                </h1>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {summary?.result?.totalClient || 0}
                </p>
              </div>
              <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
                <User size={17} />
              </div>
            </Link>
            <Link
              href="/business-management"
              className={`flex justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 items-center px-6 py-8 rounded-2xl cursor-pointer`}
            >
              <div>
                <h1 className="text-gray-500 dark:text-slate-400">
                  Total Business
                </h1>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {summary?.result?.totalBusiness || 0}
                </p>
              </div>
              <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
                <RiDiscountPercentLine size={17} />
              </div>
            </Link>
            <Link
              href="/earnings-management"
              className={`flex justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 items-center px-6 py-8 rounded-2xl cursor-pointer`}
            >
              <div>
                <h1 className="text-gray-500 dark:text-slate-400">
                  Total Earnings
                </h1>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {summary?.result?.totalEarnings || 0}
                </p>
              </div>
              <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
                <Wallet size={17} />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-3 mt-8 gap-8">
            <div className="col-span-3 xl:col-span-2">
              <EarningSummary title="Earning Report"></EarningSummary>
            </div>
            <div className="col-span-3 xl:col-span-1">
              <PerformanceSummary></PerformanceSummary>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-8 gap-8">
            <div className="col-span-2 xl:col-span-1">
              <TopSellingServices setActive={setActive}></TopSellingServices>
            </div>
            <div className="col-span-2 xl:col-span-1">
              <RecentActivities setActive={setActive}></RecentActivities>
            </div>
          </div>
        </div>
      )}

      {active == "service" && (
        <AllMostRequested
          title="Top Selling Services"
          count={15}
        ></AllMostRequested>
      )}
      {active == "booking" && <AllRecentActivities></AllRecentActivities>}
    </>
  );
};

export default Overview;
