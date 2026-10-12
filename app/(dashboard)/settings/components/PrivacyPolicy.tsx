/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DOMPurify from "dompurify";
import "@/components/Common/MYTextEditor.css";
import { SyncLoader } from "react-spinners";
import { useGetAllPrivacyPolicyQuery } from "@/redux/api/content.api";
import { UpdatePrivacyPolicy } from "./UpdatePrivacyPolicy";

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetAllPrivacyPolicyQuery("User");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-4 my-10">
        <span className="text-bprimary">Privacy Policy is Loading</span>
        <SyncLoader color="#E35314" size={12} />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {data?.result?.map((terms: any, idx: number) => (
        <div key={idx} className="relative">
          <div>
            <div className="flex justify-between pb-6 items-center">
              <h1 className="text-xl font-medium text-slate-900 dark:text-slate-100">
                Privacy Policy
              </h1>
              <UpdatePrivacyPolicy pkey="User"></UpdatePrivacyPolicy>
            </div>
            <div>
              <div
                className="description bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm p-6 md:p-10"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.result[0]?.content),
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
