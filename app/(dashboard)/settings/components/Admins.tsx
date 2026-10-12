"use client";

import { useAdminsQuery } from "@/redux/api/authApi";
import AdminDetailsModal from "./AdminDetailsModal";

const Admins = () => {
  const { data, isLoading } = useAdminsQuery("");

  return (
    <div>
      <h1 className="border-b border-gray-200 dark:border-slate-800 pb-4 text-slate-900 dark:text-slate-100">
        User Accessibility
      </h1>
      <h1 className="py-4 text-slate-800 dark:text-slate-200">Admin List</h1>
      <div className="pb-6">
        {isLoading ? (
          <p className="text-sm text-[#636F85] dark:text-slate-400">
            Loading admins...
          </p>
        ) : (
          data?.result?.map((admin: any) => (
            <div className="mb-2" key={admin?.id}>
              <AdminDetailsModal
                id={admin?.id}
                adminName={admin?.adminName}
                profileImage={
                  admin?.profileImage ||
                  "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admins;
