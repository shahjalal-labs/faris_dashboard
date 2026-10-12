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
import { RotateCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useTopClientsQuery } from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";

const TopClients = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useTopClientsQuery({ page, searchTerm: searchTerm || "" });

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Top Clients</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by name or email.."
            type="text"
          />
          <button
            onClick={() => refetch()}
            className="border border-gray-300 dark:border-slate-700 flex items-center justify-center gap-1 px-4 text-gray-600 dark:text-slate-200 rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              User Details
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.users?.length > 0 && !isFetching ? (
            users.result.users.map((user: any) => {
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
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.phoneNumber}</TableCell>
                  <TableCell>{user?._count?.userBookings || 0}</TableCell>
                  <TableCell className="px-2 py-1">
                    <span
                      className={`px-2 py-1 rounded-xl text-sm font-medium ${
                        user?.status === "Deactivated"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {user.status == "Deactivated" ? "Blocked" : "Active"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Client"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.users?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default TopClients;
