"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { SlMenu } from "react-icons/sl";
import { Bell, Moon, RotateCw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

interface TopNavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const TopNavbar = ({ isSidebarOpen, toggleSidebar }: TopNavbarProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: profile } = useGetMyProfileQuery("");
  const pathname = usePathname();

  const isNotificationActive = pathname?.includes("/notification");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 flex justify-between items-center gap-2 h-[90px] fixed z-20 top-0 left-0 right-0 w-full lg:left-[250px] xl:left-[286px] lg:w-[calc(100%-250px)] xl:w-[calc(100%-286px)] px-4 md:px-6 lg:shadow-xs dark:shadow-none border-b border-transparent dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center rounded-md bg-bprimary/10 p-2 text-bprimary lg:hidden"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isSidebarOpen ? <IoClose size={20} /> : <SlMenu size={20} />}
          </button>
          <h1 className="md:text-2xl text-[#2D2D2D] dark:text-slate-100 font-bold">
            Overview
          </h1>
        </div>

        <div className="flex justify-end items-center gap-3 lg:gap-4">
          {/* <div className="bg-bprimary shadow-[0_0_10px_0_rgba(227, 83, 20, 0.10)] rounded-full p-1.5">
            <Image
              src={download}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-6 h-6"
              priority
            />
          </div> */}
          <button
            onClick={() => window.location.reload()}
            className="shadow-sm flex items-center justify-center gap-1 px-4 text-gray-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[18px] cursor-pointer py-2 md:justify-start"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>

          <button
            onClick={handleThemeToggle}
            className="shadow-sm flex items-center justify-center gap-2 px-4 text-gray-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[18px] cursor-pointer py-2 md:justify-start"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mounted && isDark ? <Sun size={15} /> : <Moon size={15} />}
            {mounted ? (isDark ? "Light" : "Dark") : "Theme"}
          </button>

          <Link
            href={"/notification"}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              isNotificationActive
                ? "text-bprimary bg-bprimary/10"
                : "text-gray-600 dark:text-slate-200"
            }`}
          >
            <Bell size={20} />
          </Link>

          {/* <Link
            href="/settings"
            className="flex justify-center items-center gap-3 text-[#636F85] dark:text-slate-200 font-medium bg-[#F5F5F5] dark:bg-slate-800 rounded-3xl h-full cursor-pointer"
          >
            <Image
              src={
                profile?.result?.profileImage ||
                "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
              }
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-10 h-10"
              priority
            />
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
