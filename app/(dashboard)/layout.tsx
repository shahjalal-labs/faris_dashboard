import type { Metadata } from "next";
import "../globals.css";
import DashboardShell from "@/components/Navbar/DashboardShell";

export const metadata: Metadata = {
  title: "Shaara - Dashboard",
  description: "Admin dashboard for Shaara platform",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
