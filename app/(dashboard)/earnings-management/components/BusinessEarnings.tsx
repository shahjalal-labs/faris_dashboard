"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoData from "@/components/Common/NoData";
import { useBusinessEarningsQuery } from "@/redux/api/business.Api";
import { SaudiRiyal } from "lucide-react";

const BusinessEarnings = () => {
  const { data: users, isLoading, isFetching } = useBusinessEarningsQuery("");

  return (
    <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[6px]">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-bold">Business Earning</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Business Name
            </TableHead>
            <TableHead>Business Category</TableHead>
            <TableHead>Total Earnings</TableHead>
            <TableHead>Total Services Count</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Growth(%)</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.length > 0 ? (
            users.result.map((user: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{user?.provider?.fullName}</TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.serviceCategory} Service
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                        <SaudiRiyal className="text-[#191919]"></SaudiRiyal>
                      <p>{user?.totalEarnings}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user?.provider?._count?.services}</TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.region || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.city || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.provider?._count?.providerBookings}
                  </TableCell>
                  <TableCell
                    className={`${user?.growthPercentage > 0 ? "text-green-500" : "text-red-600"}`}
                  >
                    {user?.growthPercentage}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Business"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessEarnings;
