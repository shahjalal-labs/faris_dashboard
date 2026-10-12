"use client";

import { useState } from "react";
import { useCurrentFormulaQuery } from "@/redux/api/content.api";
import UpdateFormulaModal from "./UpdateFormulaModal";

const CurrentFormula = () => {
  const { data, isLoading } = useCurrentFormulaQuery("");
  const [open, setOpen] = useState(false);

  const formula = data?.result;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Activation Formula
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review the current values and update them when needed.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-bprimary text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
          disabled={isLoading || !formula}
        >
          Update
        </button>
      </div>

      {isLoading ? (
        <div className="text-slate-600 dark:text-slate-300">Loading...</div>
      ) : formula ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Days
            </p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {formula.days}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Service
            </p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {formula.service}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-slate-600 dark:text-slate-300">
          No formula data found.
        </div>
      )}

      <UpdateFormulaModal
        open={open}
        onOpenChange={setOpen}
        currentFormula={formula}
      />
    </div>
  );
};

export default CurrentFormula;
