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

import { useMostRequestedQuery } from "@/redux/api/serviceApi";
import { SaudiRiyal } from "lucide-react";

const TopSellingServices = ({ setActive }: any) => {
  const {
    data: business,
    isLoading,
    isFetching,
  } = useMostRequestedQuery({
    page: 1,
    limit: 5,
    search: "",
    city: "",
    region: "",
    category: "",
  });

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium text-slate-900 dark:text-slate-100">
          Top Selling Services
        </h1>
        <button
          onClick={() => setActive("service")}
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
            <TableHead>Category</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Price</TableHead>
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
                  <TableCell>{user?.serviceCategory} Service</TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.region || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles?.[0]?.city || "---"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <SaudiRiyal />
                      <p>{user?.servicePrice || 0}</p>
                    </div>
                  </TableCell>
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
    </div>
  );
};

export default TopSellingServices;
