"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReasonMutation } from "@/redux/api/content.api";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

type RoleType = "User" | "Provider";

const AddReasonModal = () => {
  const [createReason, { isLoading }] = useCreateReasonMutation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [role, setRole] = useState<RoleType>("User");

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const resetForm = () => {
    setReason("");
    setRole("User");
  };

  const handleCreate = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast.warning("Reason is required");
      return;
    }

    const payload = {
      reason: trimmedReason,
      role,
    };

    try {
      const response = await createReason(payload).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Reason added successfully");
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.warning(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to add reason",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!editable}
          className="cursor-pointer disabled:cursor-not-allowed flex gap-1 font-medium items-center bg-bprimary text-white rounded-4xl px-2 md:px-3 py-2 "
        >
          <Plus size={20}></Plus> Add
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-slate-100">
            Add Cancellation Reason
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Reason
            </Label>
            <Input
              id="reason"
              name="reason"
              placeholder="Write cancellation reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-12 rounded-xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Role
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as RoleType)}
            >
              <SelectTrigger
                id="role"
                className="h-12 rounded-xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">Client</SelectItem>
                <SelectItem value="Provider">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-bprimary disabled:bg-gray-400 cursor-pointer px-4 py-1 text-white"
              onClick={handleCreate}
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReasonModal;
