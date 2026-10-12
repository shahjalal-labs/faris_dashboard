"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import NoData from "@/components/Common/NoData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllBusinessQuery } from "@/redux/api/business.Api";
import Pagination from "@/components/Common/Pagination";
import { Download, Eye, Loader, RotateCw, Trash2 } from "lucide-react";
import {
  useDeleteUserMutation,
  useGetMyProfileQuery,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import BusinessOverview from "./BusinessOverview";
import regionList from "@/components/Common/Region.json";
import cityList from "@/components/Common/Cities.json";
import * as XLSX from "xlsx";
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
import { Calendar } from "lucide-react";

const DateField = ({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : label;

  return (
    <label
      onClick={() => {
        if (inputRef.current?.showPicker) {
          inputRef.current.showPicker();
          return;
        }

        inputRef.current?.click();
      }}
      className="relative flex h-10 w-full cursor-pointer items-center rounded-[6px] border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 md:w-[170px]"
    >
      <span
        className={
          value
            ? "text-slate-900 dark:text-slate-100"
            : "text-slate-500 dark:text-slate-400"
        }
      >
        {displayValue}
      </span>
      <Calendar className="ml-auto h-4 w-4 text-slate-500 dark:text-slate-400" />
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={label}
      />
    </label>
  );
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "Active":
      return {
        text: "Active",
        className:
          "text-green-600 bg-green-50 px-4 py-1 rounded-[6px] font-semibold",
      };
    case "Pending":
      return {
        text: "Pending",
        className:
          "text-yellow-600 bg-yellow-50 px-4 py-1 rounded-[6px] font-semibold",
      };
    case "Deactivated":
      return {
        text: "Inactive",
        className:
          "text-red-600 bg-red-50 px-4 py-1 rounded-[6px] font-semibold",
      };
    default:
      return {
        text: status,
        className:
          "text-yellow-600 bg-yellow-50 px-4 py-1 rounded-[6px] font-semibold",
      };
  }
};

const getVerificationDisplay = (status: string) => {
  if (status === "Pending") {
    return {
      text: "Pending",
      className:
        "text-yellow-600 bg-yellow-50 px-4 py-1 rounded-[6px] font-semibold",
    };
  }

  if (status === "Rejected") {
    return {
      text: "Rejected",
      className: "text-red-500 bg-red-50 px-4 py-1 rounded-[6px] font-semibold",
    };
  }
  return {
    text: "Verified",
    className:
      "text-green-600 bg-green-50 px-4 py-1 rounded-[6px] font-semibold",
  };
};

const AllBusiness = ({ setStatus, setId }: any) => {
  const [deleteId, setDeleteId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [isRecent, setIsRecent] = useState("true");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

  const filteredCities = region
    ? cityList.filter((item) => item.region === region)
    : cityList;

  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useAllBusinessQuery({ page, search, city, region, category, isRecent });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const totalPage = users?.result?.meta?.totalPages;
  const businessRows = users?.result?.business || [];

  const filteredBusinesses = useMemo(() => {
    return businessRows.filter((business: any) => {
      if (!business?.createdAt) return false;

      const createdAtDate = new Date(business.createdAt);
      if (Number.isNaN(createdAtDate.getTime())) return false;

      const createdAtOnly = createdAtDate.toISOString().slice(0, 10);

      if (fromDate && createdAtOnly < fromDate) return false;
      if (toDate && createdAtOnly > toDate) return false;

      return true;
    });
  }, [businessRows, fromDate, toDate]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams?.get("search") || searchParams?.get("q");
    if (q && q !== search) {
      setSearch(q);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleExport = () => {
    if (filteredBusinesses.length === 0) {
      toast.error("No business data available to export");
      return;
    }

    const exportData = filteredBusinesses.map((user: any) => ({
      "Business Name": user?.fullName || "---",
      "Registration Date": formatDate(user?.createdAt),
      Category: user?.providerProfiles?.[0]?.serviceCategory || "---",
      Region: user?.providerProfiles?.[0]?.region || "---",
      City: user?.providerProfiles?.[0]?.city || "---",
      Status: getStatusDisplay(user?.status).text,
      "Verification Status": getVerificationDisplay(user?.status).text,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Businesses");
    XLSX.writeFile(
      workbook,
      `business-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const handleSet = (id: string) => {
    setId(id);
    setStatus("details");
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const res = await deleteUser(id).unwrap();
    if (res?.success) {
      setDeleteId("");
      toast.success("Business deleted successfully");
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <BusinessOverview></BusinessOverview>
      <div className="mb-6 rounded-[6px] border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <select
            value={region}
            onChange={(e) => {
              const selectedRegion = e.target.value;
              setRegion(selectedRegion);
              setCity("");
              setPage(1);
            }}
            className="h-10 w-full rounded-[6px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-bprimary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
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
            className="h-10 w-full rounded-[6px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-bprimary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
          >
            <option value="">City</option>
            {filteredCities.map((item) => (
              <option key={`${item.region}-${item.name}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:col-span-4">
            <DateField
              label="From Date"
              value={fromDate}
              onChange={(value) => {
                setFromDate(value);
                setPage(1);
              }}
            />
            <DateField
              label="To Date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(value) => {
                setToDate(value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-[6px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-bprimary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-4"
          >
            <option value="">Category</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Both">Male & Female</option>
          </select>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_140px_auto] xl:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search business"
            className="h-10 w-full rounded-[6px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-bprimary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <select
            value={isRecent}
            onChange={(e) => {
              setIsRecent(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-[6px] border border-gray-300 bg-white px-3 text-sm outline-none focus:border-bprimary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="true">Recent</option>
            <option value="false">Oldest</option>
          </select>

          <button
            disabled={!editable}
            type="button"
            onClick={handleExport}
            className="h-10 w-full disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 rounded-[6px] border border-gray-300 bg-bprimary px-3 text-sm text-white cursor-pointer dark:border-slate-700 dark:text-slate-100 xl:w-auto"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[6px]">
        <div className="flex justify-between mb-4 items-center gap-4 flex-wrap">
          <h1 className="font-medium">Business List</h1>
        </div>

        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 dark:bg-slate-800">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                Business List
              </TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((user: any) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div
                        onClick={() => handleSet(user.id)}
                        className="flex cursor-pointer items-center space-x-3"
                      >
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
                    <TableCell>{formatDate(user?.createdAt)}</TableCell>
                    <TableCell>
                      {user?.providerProfiles?.[0]?.serviceCategory == "Male"
                        ? "Male"
                        : user?.providerProfiles?.[0]?.serviceCategory ==
                            "Female"
                          ? "Female"
                          : user?.providerProfiles?.[0]?.serviceCategory ==
                              "Both"
                            ? "Male & Female"
                            : "---"}
                    </TableCell>
                    <TableCell>
                      {user?.providerProfiles?.[0]?.region || "---"}
                    </TableCell>
                    <TableCell>
                      {user?.providerProfiles?.[0]?.city || "---"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          getStatusDisplay(user?.modifiedStatus).className
                        }
                      >
                        {getStatusDisplay(user?.modifiedStatus).text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          getVerificationDisplay(user?.status).className
                        }
                      >
                        {getVerificationDisplay(user?.status).text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye
                          onClick={() => handleSet(user.id)}
                          className="text-yellow-400 cursor-pointer"
                        ></Eye>
                        {isDeleting && deleteId === user.id ? (
                          <Loader className="animate-spin text-red-500" />
                        ) : (
                          <button
                            disabled={!editable}
                            className="disabled:cursor-not-allowed cursor-pointer text-red-500 disabled:text-gray-800"
                            onClick={() =>
                              setDeleteTarget({
                                id: user.id,
                                name: user?.fullName || "this business",
                              })
                            }
                          >
                            <Trash2></Trash2>
                          </button>
                        )}
                      </div>
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

        {filteredBusinesses.length > 0 && (
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
                {deleteTarget?.name || "this business"}. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-bprimary hover:bg-bprimary"
                onClick={() => {
                  if (deleteTarget) {
                    handleDelete(deleteTarget.id);
                  }
                }}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AllBusiness;
