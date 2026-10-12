"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useUpdateWelcomeMutation } from "@/redux/api/content.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

type Role = "Provider" | "User";

interface UpdateWelcomeModalProps {
  role: Role;
  content?: string;
}

const UpdateWelcomeModal = ({
  role,
  content = "",
}: UpdateWelcomeModalProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(content);
  const [updateWelcome, { isLoading }] = useUpdateWelcomeMutation();

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  useEffect(() => {
    if (open) {
      setMessage(content);
    }
  }, [open, role, content]);

  const handleUpdate = async () => {
    if (!message.trim()) {
      toast.error("Content is required");
      return;
    }

    const response: any = await updateWelcome({
      content: message.trim(),
      key: role,
    });

    if (response?.data?.success) {
      toast.success(
        response.data.message || "Welcome message updated successfully",
      );
      setOpen(false);
      return;
    }

    toast.error(
      response?.error?.data?.message || "Failed to update welcome message",
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
        disabled={!editable}
          type="button"
          className="p-2 disabled:cursor-not-allowed rounded-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 cursor-pointer"
        >
          <Pencil className="h-4 w-4 text-gray-700 dark:text-slate-300" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 rounded-lg">
        <DialogHeader>
          <DialogTitle>Update Welcome Message</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Content
            </label>
            <Textarea
              placeholder="Write welcome message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isLoading || !message.trim()}
            className="mt-1 bg-bprimary cursor-pointer disabled:bg-gray-400 text-white py-2 rounded-lg"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWelcomeModal;
