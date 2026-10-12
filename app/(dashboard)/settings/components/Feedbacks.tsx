"use client";

import { useGetMyProfileQuery } from "@/redux/api/authApi";
import {
  useDeleteFeedbackMutation,
  useFeedbacksQuery,
} from "@/redux/api/content.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Feedbacks = () => {
  const { data, isLoading } = useFeedbacksQuery("");
  const [deleteFeedback] = useDeleteFeedbackMutation();
    const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const handleDelete = async (id: string) => {
    const res = await deleteFeedback(id).unwrap();
    if (res.success) {
      toast.success("Feedback deleted successfully");
    }
  };
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <h1 className="border-b border-gray-200 dark:border-slate-800 font-semibold text-xl py-3 px-4 text-slate-900 dark:text-slate-100">
        Feedback
      </h1>
      <div className="px-4 py-6">
        {data?.result?.map((feedback: any) => (
          <div
            className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800 last:border-b-0"
            key={feedback.id}
          >
            <h3 className="font-medium text-slate-700 dark:text-slate-300">
              {feedback.content}
            </h3>
            <div className="flex items-center gap-2">
              <Trash2
                onClick={() => handleDelete(feedback.id)}
                className="text-red-500 cursor-pointer"
              ></Trash2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
