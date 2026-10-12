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
import { Eye, RotateCw, SaudiRiyal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useUserDetailsQuery } from "@/redux/api/authApi";
import UserBookingDetailsModal from "./UserBookingDetailsModal";

const UserBookings = ({ id }: any) => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [sortBy, setSortBy] = useState("recent");

  const {
    data: business,
    isLoading,
    isFetching,
    refetch,
  } = useUserDetailsQuery(id);
  const bookings = business?.result?.userBookings || [];
  const filteredAndSortedBookings = [...bookings].sort((a: any, b: any) => {
    const aTime = new Date(a?.createdAt || a?.date).getTime() || 0;
    const bTime = new Date(b?.createdAt || b?.date).getTime() || 0;

    if (sortBy === "oldest") return aTime - bTime;
    return bTime - aTime;
  });

  const totalPrice = business?.result?.userBookings
    ?.filter((booking: any) => booking?.status === "Completed")
    ?.reduce((sum: number, booking: any) => sum + (booking?.price || 0), 0);

  return (
    <div>
      <div className="flex flex-col items-center rounded-2xl bg-bprimary/10 py-6 my-6">
        <h1>Total Earnings From this clinet</h1>
        <div className="flex pt-3 items-center ">
          <SaudiRiyal></SaudiRiyal>
          <p className="text-3xl font-medium">{totalPrice?.toLocaleString()}</p>
        </div>
      </div>
      <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
          <h1 className="md:font-medium">Booking List</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
              placeholder="search by name or email.."
              type="text"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
            </select>
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
                Service Name
              </TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Booking Time</TableHead>
              <TableHead>Service Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedBookings?.length > 0 && !isFetching ? (
              filteredAndSortedBookings.map((user: any) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex cursor-pointer items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user?.service?.url1 ||
                              user?.offer?.url1 ||
                              "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                            }
                            alt={
                              user?.service?.serviceName ||
                              user?.offer?.serviceName
                            }
                          />
                          <AvatarFallback>
                            {user?.service?.serviceName ||
                              user?.offer?.serviceName}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {user?.service?.serviceName ||
                            user?.offer?.serviceName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user?.provider?.fullName}</TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles[0]?.region}
                    </TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles[0]?.city}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const dateObj = new Date(user?.date);
                        if (Number.isNaN(dateObj.getTime())) return "-";
                        const day = String(dateObj.getDate()).padStart(2, "0");
                        const month = String(dateObj.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const year = dateObj.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </TableCell>
                    <TableCell>{user?.time}</TableCell>
                    <TableCell>{user?.price}</TableCell>
                    <TableCell className="px-2 py-1">
                      <span
                        className={`px-4 py-1 rounded-[7px] text-sm font-medium ${
                          user?.status === "Pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : user?.status === "Cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserBookingDetailsModal
                          id={user.id}
                          status={user.status}
                          serviceName={
                            user.service?.serviceName || user.offer?.serviceName
                          }
                          businessName={user.provider?.fullName}
                          date={user.date}
                          time={user.time}
                          price={user.price}
                        ></UserBookingDetailsModal>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoData
                title="Booking"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserBookings;
