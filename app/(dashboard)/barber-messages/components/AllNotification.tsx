"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import {
  useAllNotificationQuery,
  useDeleteNotificationMutation,
} from "@/redux/api/content.api";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const AllNotifications = () => {
  const [page, setPage] = useState(1);
  const [deleteNotification, { isLoading: isDeleteLoading }] =
    useDeleteNotificationMutation();

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  // 🔑 Track which row is being acted on

  const { data: users, isLoading, isFetching } = useAllNotificationQuery(page);

  console.log(users?.result);

  const totalPage = users?.result?.meta?.totalPages;

  const handleDelete = async (id: string) => {
    const response = await deleteNotification(id).unwrap();
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.error.message);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Message List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Receiver Type
            </TableHead>
            <TableHead>Receiver Details</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.adminNotifications?.length > 0 ? (
            users.result.adminNotifications.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {user?.receiver == "Users"
                      ? "Clients"
                      : user?.receiver == "SingleUser"
                        ? "Individual"
                        : user?.receiver == "Providers"
                          ? "Providers"
                          : "All Users"}
                  </TableCell>
                  <TableCell>
                    {user?.receiver == "SingleUser" ? (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user?.user?.profileImage ||
                              "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                            }
                            alt={user?.user?.fullName}
                          />
                          <AvatarFallback>
                            {user?.user?.fullName}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {user?.user?.fullName}
                        </span>
                      </div>
                    ) : (
                      "-----"
                    )}
                  </TableCell>
                  <TableCell>{user?.content}</TableCell>
                  <TableCell>
                    {new Date(user?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>

                  <TableCell>
                    <button
                      className="text-red-400 disabled:cursor-not-allowed disabled:text-gray-600 cursor-pointer"
                      disabled={isDeleteLoading || !editable}
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2></Trash2>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Notification"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.adminNotifications?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllNotifications;
