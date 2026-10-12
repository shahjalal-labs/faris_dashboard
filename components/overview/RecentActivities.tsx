"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";

import { useAllbookingsQuery } from "@/redux/api/bookingApi";
import { SaudiRiyal } from "lucide-react";

const RecentActivities = ({ setActive }: any) => {
  const {
    data: business,
    isLoading,
    isFetching,
  } = useAllbookingsQuery({
    page: 1,
    limit: 5,
    search: "",
    region: "",
    city: "",
    category: "",
    status: "",
  });

  const formatDate = (iso?: string) => {
    if (!iso) return "---";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "---";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium text-slate-900 dark:text-slate-100">
          Recent Activities
        </h1>
        <button
          onClick={() => setActive("booking")}
          className="border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
        >
          See More
        </button>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-200 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[150px] whitespace-nowrap">
              Service Name
            </TableHead>
            <TableHead>City</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {business?.result?.bookings?.length > 0 ? (
            business?.result?.bookings.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.service?.url1 ||
                            user?.offer?.mediaUrl1 ||
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
                        {user?.service?.serviceName || user?.offer?.serviceName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.city || "---"}
                  </TableCell>
                  <TableCell>{formatDate(user?.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <SaudiRiyal></SaudiRiyal>
                      <p>{user?.price}</p>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Activity"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentActivities;
