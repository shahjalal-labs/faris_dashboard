"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import TopNavbar from "./TopNavbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

const DashboardShell = ({ children }: DashboardShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFD] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="w-full overflow-y-auto bg-[#F8FAFD] dark:bg-slate-950 transition-colors">
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="p-6 mt-24">{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;
