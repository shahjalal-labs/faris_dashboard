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
import { RotateCw, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useBusinessProfileQuery } from "@/redux/api/business.Api";
import AddServiceModal from "./AddServiceModal";
import { useDeleteServiceMutation } from "@/redux/api/serviceApi";
import { toast } from "sonner";
import ServiceDetailsModal from "../../service-management/ServiceDetailsModal";
import EditServiceModal from "../../service-management/EditServiceModal";

const Services = ({ id }: any) => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [deleteService] = useDeleteServiceMutation();

  const {
    data: business,
    isLoading,
    isFetching,
    refetch,
  } = useBusinessProfileQuery(id);

  const hanleDelete = async (id: string) => {
    const res = await deleteService(id).unwrap();
    if (res.success) {
      toast.success("Service deleted successfully");
    }
  };

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Service List</h1>
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
          <AddServiceModal providerId={id}></AddServiceModal>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Service Name
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Service Mode</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {business?.result?.services?.length > 0 && !isFetching ? (
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
                  <TableCell>{user?.serviceCategory}</TableCell>
                  <TableCell>
                    {user?.serviceMode == "Online"
                      ? "In-center"
                      : "Out-of-center"}
                  </TableCell>
                  <TableCell>{user?.duration}</TableCell>
                  <TableCell>{user?.servicePrice}</TableCell>
                  <TableCell>{user?._count?.bookings || 0}</TableCell>
                  <TableCell className="px-2 py-1">
                    <span
                      className={`px-4 py-1 rounded-[7px] text-sm font-medium ${
                        user?.status === "Deactivated"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ServiceDetailsModal id={user.id}></ServiceDetailsModal>
                      <EditServiceModal id={user.id}></EditServiceModal>
                      <Trash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => hanleDelete(user.id)}
                      />
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

export default Services;
