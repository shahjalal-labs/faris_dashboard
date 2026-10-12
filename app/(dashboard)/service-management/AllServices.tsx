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
import { Download, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import {
  useAllServicesQuery,
  useDeleteServiceMutation,
} from "@/redux/api/serviceApi";
import Pagination from "@/components/Common/Pagination";
import ServiceDetailsModal from "./ServiceDetailsModal";
import EditServiceModal from "./EditServiceModal";
import regionList from "@/components/Common/Region.json";
import cityList from "@/components/Common/Cities.json";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AllServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteService] = useDeleteServiceMutation();

  const filteredCities = region
    ? cityList.filter((item) => item.region === region)
    : cityList;

  const {
    data: business,
    isLoading,
    isFetching,
  } = useAllServicesQuery({ page, search: searchTerm, region, city, category });

  const totalPage = business?.result?.meta?.totalPages;
  const serviceRows = business?.result?.services || [];

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const handleExport = () => {
    if (serviceRows.length === 0) {
      toast.error("No service data available to export");
      return;
    }

    const exportData = serviceRows.map((user: any) => ({
      "Service Name": user?.serviceName || "---",
      "Business Name": user?.provider?.fullName || "---",
      Category: user?.serviceCategory || "---",
      Region: user?.provider?.providerProfiles?.[0]?.region || "---",
      City: user?.provider?.providerProfiles?.[0]?.city || "---",
      "Service Mode":
        user?.serviceMode == "Online" ? "Out-of-center" : "In-center",
      Duration: user?.duration || "---",
      Price: user?.servicePrice || "---",
      Booking: user?._count?.bookings || 0,
      Status: user?.status || "---",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Services");
    XLSX.writeFile(
      workbook,
      `service-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const hanleDelete = async (id: string) => {
    const res = await deleteService(id).unwrap();
    if (res.success) {
      toast.success("Service deleted successfully");
    }
    setDeleteTarget(null);
  };

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium text-2xl">Service List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto flex-wrap">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by service name"
            type="text"
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
          >
            <option value="">Category</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Both">Male & Female</option> */}
          </select>
          <select
            value={region}
            onChange={(e) => {
              const selectedRegion = e.target.value;
              setRegion(selectedRegion);
              setCity("");
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
          >
            <option value="">Region</option>
            {regionList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
          >
            <option value="">City</option>
            {filteredCities.map((item) => (
              <option key={`${item.region}-${item.name}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            disabled={!editable}
            type="button"
            onClick={handleExport}
            className="border flex disabled:cursor-not-allowed items-center justify-center gap-1 px-4 text-white bg-bprimary rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Export <Download size={15} />
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
            <TableHead>Category</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Service Mode</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {serviceRows.length > 0 ? (
            serviceRows.map((user: any) => {
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
                  <TableCell>{user?.serviceCategory}</TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles[0]?.region}
                  </TableCell>
                  <TableCell>
                    {user?.provider?.providerProfiles[0]?.city}
                  </TableCell>
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
                      <button
                        disabled={!editable}
                        className="text-red-500 disabled:cursor-not-allowed cursor-pointer disabled:text-gray-700"
                        onClick={() =>
                          setDeleteTarget({
                            id: user.id,
                            name: user?.serviceName || "this service",
                          })
                        }
                      >
                        <Trash2></Trash2>
                      </button>
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
      {serviceRows.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {deleteTarget?.name || "this service"}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-bprimary hover:bg-bprimary"
              onClick={() => {
                if (deleteTarget) {
                  hanleDelete(deleteTarget.id);
                }
              }}
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllServices;
