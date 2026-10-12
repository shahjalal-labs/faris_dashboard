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
import { Download, Eye, RotateCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useBusinessProfileQuery } from "@/redux/api/business.Api";
import UserBookingDetailsModal from "../../client-management/components/UserBookingDetailsModal";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const Bookings = ({ id }: any) => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [searchTerm, setSearchTerm] = useState(searchData);

  const {
    data: business,
    isLoading,
    isFetching,
    refetch,
  } = useBusinessProfileQuery(id);
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const formatDate = (iso?: string) => {
    if (!iso) return "---";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "---";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleExport = () => {
    const bookingRows = business?.result?.providerBookings || [];

    if (bookingRows.length === 0) {
      toast.error("No booking data available to export");
      return;
    }

    const exportData = bookingRows.map((user: any) => ({
      "Client Name": user?.user?.fullName || "---",
      "Service Name":
        user?.service?.serviceName || user?.offer?.serviceName || "---",
      Date: formatDate(user?.date),
      "Booking Time": user?.time || "---",
      "Service Price": user?.price || "---",
      Status: user?.status || "---",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(
      workbook,
      `booking-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
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
          <button
            disabled={!editable}
            type="button"
            onClick={handleExport}
            className="border flex disabled:cursor-not-allowed items-center justify-center gap-1 px-4 text-white bg-bprimary rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Export <Download size={15} />
          </button>
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
              Client Name
            </TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Booking Time</TableHead>
            <TableHead>Service Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {business?.result?.providerBookings?.length > 0 && !isFetching ? (
            business?.result?.providerBookings.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.user?.profileImage ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.user?.fullName}
                        />
                        <AvatarFallback>{user?.user?.fullName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {user?.user?.fullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.service?.serviceName || user?.offer?.serviceName}
                  </TableCell>
                  <TableCell>{formatDate(user?.date)}</TableCell>
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
  );
};

export default Bookings;
