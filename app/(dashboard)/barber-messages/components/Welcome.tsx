"use client";

import { useGetWelcomeQuery } from "@/redux/api/content.api";
import UpdateWelcomeModal from "./UpdateWelcomeModal";

type Role = "Provider" | "User";

interface WelcomeProps {
  role?: Role;
}

const Welcome = ({ role }: WelcomeProps) => {
  const orderedRoles: Role[] =
    role === "User" ? ["User", "Provider"] : ["Provider", "User"];

  const { data: providerWelcome, isLoading: providerLoading } =
    useGetWelcomeQuery("Provider");
  const { data: userWelcome, isLoading: userLoading } =
    useGetWelcomeQuery("User");

  const welcomeByRole: Record<Role, string> = {
    Provider: providerWelcome?.result?.[0]?.content || "",
    User: userWelcome?.result?.[0]?.content || "",
  };

  const loadingByRole: Record<Role, boolean> = {
    Provider: providerLoading,
    User: userLoading,
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {orderedRoles.map((item) => (
        <div
          key={item}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-slate-100">
              {item == "User" ? "Client" : "Business"} Welcome Message
            </h2>
            <UpdateWelcomeModal role={item} content={welcomeByRole[item]} />
          </div>

          <p className="text-sm text-gray-700 dark:text-slate-300 min-h-12">
            {loadingByRole[item]
              ? "Loading..."
              : welcomeByRole[item] || "No welcome message found."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Welcome;
