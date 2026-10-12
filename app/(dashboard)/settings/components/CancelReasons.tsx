"use client";

import {
  useDeleteReasonMutation,
  useReasonsQuery,
} from "@/redux/api/content.api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import AddReasonModal from "./AddReasonModa";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const CancelReasons = () => {
  const [role, setType] = useState("User");
  const { data } = useReasonsQuery(role);
  const [deleteReason] = useDeleteReasonMutation();

    const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const handleDelete = async (id: string) => {
    const res = await deleteReason(id).unwrap();
    if (res.success) {
      toast.success("Reason deleted successfully");
    }
  };
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
      <div className="md:flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-lg pb-2 md:pb-0 font-medium text-slate-900 dark:text-slate-100">
          Cancellation Reason List
        </h1>
        <div className="flex gap-2">
          <select
            name=""
            id=""
            className="border border-gray-300 dark:border-slate-700 px-1 md:px-3 rounded-xl py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            value={role}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="User">Client Cancellation List </option>
            <option value="Provider">Business Cancellation List </option>
          </select>
          <AddReasonModal></AddReasonModal>
        </div>
      </div>
      <div className="p-5">
        {data?.result?.length > 0 ? (
          <>
            {data?.result?.map((reason: any) => (
              <div
                className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800 last:border-b-0"
                key={reason.id}
              >
                <h3 className="font-medium text-slate-700 dark:text-slate-300">
                  {reason.reason}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!editable}
                    onClick={() => handleDelete(reason.id)}
                    className="text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-100"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center text-red-500">
            No cancellation reasons found for the selected role.
          </p>
        )}
      </div>
    </div>
  );
};

export default CancelReasons;
