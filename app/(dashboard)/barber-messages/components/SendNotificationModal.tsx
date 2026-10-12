"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  useAllUsersQuery,
  useGetMyProfileQuery,
  useNotifyUsresQuery,
} from "@/redux/api/authApi";
import { useSendNotificationMutation } from "@/redux/api/content.api";

const receivers = ["AllUsers", "Users", "Providers", "SingleUser"] as const;

type Receiver = (typeof receivers)[number];

const SendNotificationModal = () => {
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState<Receiver>("AllUsers");
  const [userId, setUserId] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const { data: users } = useNotifyUsresQuery("");


  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const [sendNotification, { isLoading }] = useSendNotificationMutation();
  const userList = users?.result || [];

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return userList;

    return userList.filter((user: any) => {
      const fullName = String(user?.fullName || "").toLowerCase();
      return fullName.includes(query);
    });
  }, [userList, userSearch]);

  const handleSend = async () => {
    if (!content.trim()) return;
    if (receiver === "SingleUser" && !userId) return;

    const data =
      receiver === "SingleUser"
        ? { content, receiver, userId }
        : { content, receiver };

    const response: any = await sendNotification(data);
    if (response.data) {
      setContent("");
      setReceiver("AllUsers");
      setUserId("");
      toast.success("Notification sent successfully");
    } else {
      toast.error(response.error.data.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          disabled={!editable}
          className="border-bprimary disabled:cursor-not-allowed cursor-pointer border px-4 py-2 rounded-lg text-bprimary font-medium"
        >
          Send Message
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 rounded-lg">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Content */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                Message Content
              </label>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                {content.length}/100
              </span>
            </div>
            <Textarea
              placeholder="Write message content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Select Receiver
            </label>
            <Select
              value={receiver}
              onValueChange={(value) => {
                setReceiver(value as Receiver);
                if (value !== "SingleUser") setUserId("");
                if (value !== "SingleUser") setUserSearch("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select receiver" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {receiver === "SingleUser" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Select User
              </label>
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name"
                className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-bprimary"
              />
              <Select
                value={userId}
                onValueChange={setUserId}
                open={selectOpen}
                onOpenChange={setSelectOpen}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.profileImage ?? undefined} />
                            <AvatarFallback>
                              {user.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.fullName || "Unnamed user"}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No users found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action */}
          <button
            className="mt-2 bg-bprimary cursor-pointer disabled:bg-gray-400 text-white py-2 rounded-lg"
            disabled={!content.trim() || (receiver === "SingleUser" && !userId)}
            onClick={handleSend}
          >
            {isLoading ? "Sending" : "Send"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationModal;
