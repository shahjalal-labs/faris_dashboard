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

import { useMostRequestedQuery } from "@/redux/api/serviceApi";
import Pagination from "@/components/Common/Pagination";

const MostRequested = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: business,
    isLoading,
    isFetching,
  } = useMostRequestedQuery({
    page,
    limit: 5,
    search: searchTerm,
    city: "",
    region: "",
    category: "",
  });

  const totalPage = business?.result?.meta?.totalPages;

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Most Requested Service</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by name or email.."
            type="text"
          />
          <button
            onClick={() => window.location.reload()}
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
              Service Name
            </TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Request</TableHead>
            <TableHead>Contact Info</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {business?.result?.services?.length > 0 ? (
            business?.result?.services.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.url1 ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.serviceName}
                        />
                        <AvatarFallback>{user?.serviceName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {user?.serviceName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user?.provider?.fullName}</TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.region || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.city || "---"}
                  </TableCell>
                  <TableCell>{user?.serviceCategory}</TableCell>
                  <TableCell>{user?._count?.bookings || 0}</TableCell>
                  <TableCell>{user?.provider?.phoneNumber}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Service"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
      {business?.result?.services?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default MostRequested;
