"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateFormulaMutation } from "@/redux/api/content.api";

type FormulaValue = {
  days?: number;
  service?: number;
};

type UpdateFormulaModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFormula?: FormulaValue;
};

const UpdateFormulaModal = ({
  open,
  onOpenChange,
  currentFormula,
}: UpdateFormulaModalProps) => {
  const [updateFormula, { isLoading }] = useUpdateFormulaMutation();
  const [days, setDays] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    if (!open) return;

    setDays(currentFormula?.days?.toString() ?? "");
    setService(currentFormula?.service?.toString() ?? "");
  }, [open, currentFormula]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const daysNum = Number(days);
    const serviceNum = Number(service);

    if (!Number.isInteger(daysNum) || daysNum < 1) {
      toast.error("Days must be an integer greater than or equal to 1");
      return;
    }

    if (!Number.isInteger(serviceNum) || serviceNum < 1) {
      toast.error("Service must be an integer greater than or equal to 1");
      return;
    }

    const payload = {
      days: daysNum,
      service: serviceNum,
    };

    try {
      const response = await updateFormula(payload).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Formula updated successfully");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Formula update failed", error);
      toast.error("Failed to update formula");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Update Activation Formula
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Edit the current days and service values.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Days
            </label>
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Service
            </label>
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={service}
              onChange={(e) => setService(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-bprimary px-4 py-2 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFormulaModal;
