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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import {
  useBlockedUsersQuery,
  useBlockUnblockMutation,
  useDeleteUserMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";

const BlockedUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("User");
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [blockUnblock] = useBlockUnblockMutation();

  const {
    data: users,
    isLoading,
    isFetching,
  } = useBlockedUsersQuery({ role, search: searchTerm });

  const hanldeBlockUnblock = async (id: string) => {
    const res = await blockUnblock(id).unwrap();
    if (res?.success) {
      toast.success(`Unblocked successfully`);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(id).unwrap();
    if (res?.success) {
      toast.success(
        `${role == "User" ? "Client" : "Business"} Deleted successfully`,
      );
    }
  };

  return (
    <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="md:flex justify-between mb-4 items-center">
        <h1 className="font-medium pb-2 md:pb-0 text-slate-900 dark:text-slate-100">
          Block
        </h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by name.."
            type="text"
          />
          <select
            className="border border-gray-300 dark:border-slate-700 rounded-[7px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium px-4 py-1"
            name=""
            id=""
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">Blocked Clients</option>
            <option value="Provider">Blocked Business</option>
          </select>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[300px] whitespace-nowrap">
              Blocked Clients
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.length > 0 ? (
            users.result.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.profileImage ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.fullName}
                        />
                        <AvatarFallback>{user?.fullName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {user?.fullName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p>{user?.phoneNumber}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        className="bg-bprimary px-4 py-2 rounded-[7px] text-white"
                        onClick={() => hanldeBlockUnblock(user.id)}
                      >
                        Unblock
                      </button>
                      <button
                        className="bg-red-500 px-4 py-2 rounded-[7px] text-white"
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title={role == "User" ? "Client" : "Business"}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlockedUsers;
