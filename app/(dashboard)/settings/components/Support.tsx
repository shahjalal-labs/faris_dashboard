"use client";

import {
  useDeleteFaqMutation,
  useDeleteReasonMutation,
  useFaqsQuery,
  useReasonsQuery,
} from "@/redux/api/content.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddFaqModal from "./AddFaqModal";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import UpdateFaqModal from "./UpdateFaqModal";

const Support = () => {
  const { data, isLoading } = useFaqsQuery("");
  const [deleteFaq] = useDeleteFaqMutation();

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const handleDelete = async (id: string) => {
    const res = await deleteFaq(id).unwrap();
    if (res.success) {
      toast.success("FAQ deleted successfully");
    }
  };
  return (
    <div className="rounded-2xl">
      <div className="md:flex justify-between items-center p-5">
        <h1 className="text-lg pb-2 md:pb-0 font-medium text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h1>
        <AddFaqModal></AddFaqModal>
      </div>
      <div className="p-5">
        {data?.result?.length > 0 ? (
          <>
            {data?.result?.map((reason: any) => (
              <div
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl mb-4"
                key={reason.id}
              >
                <div>
                  <div className="flex justify-between items-center ">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {reason.question}
                    </h3>

                    <div className="flex items-center">
                      <UpdateFaqModal id={reason.id}></UpdateFaqModal>
                      <button
                        disabled={!editable}
                        onClick={() => handleDelete(reason.id)}
                        className="text-gray-500 disabled:cursor-not-allowed disabled:text-gray-600 dark:text-slate-400 cursor-pointer"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-500 dark:text-slate-400 pt-2">
                    {reason.answer}
                  </h3>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center text-red-500">
            {isLoading
              ? "Loading..."
              : "No FAQs found. Please add some FAQs to assist your users."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Support;
