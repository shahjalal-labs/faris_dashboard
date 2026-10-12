"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader, RotateCw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
  useGetMyProfileQuery,
} from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";
import { toast } from "sonner";
import UserOverview from "./UserOver";
import { Download } from "lucide-react";
import { Calendar } from "lucide-react";
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

import { useMemo, useRef, useState } from "react";

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
      className="relative flex h-12 w-full cursor-pointer items-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-slate-100 md:w-[180px]"
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

const AllUsers = ({ setId, setStatus }: any) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deleteId, setDeleteId] = useState(""); // 🔑 Track which row is being acted on
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const formatDate = (iso?: string) => {
    if (!iso) return "---";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "---";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useAllUsersQuery({ page, searchTerm: searchTerm || "" });

  const totalPage = users?.result?.meta?.totalPages;
  const userRows = users?.result?.users || [];
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const filteredUsers = useMemo(() => {
    return userRows.filter((user: any) => {
      if (!user?.createdAt) return false;

      const createdAtDate = new Date(user.createdAt);
      if (Number.isNaN(createdAtDate.getTime())) return false;

      const createdAtOnly = createdAtDate.toISOString().slice(0, 10);

      if (fromDate && createdAtOnly < fromDate) return false;
      if (toDate && createdAtOnly > toDate) return false;

      return true;
    });
  }, [fromDate, toDate, userRows]);

  const handleExport = () => {
    if (filteredUsers.length === 0) {
      toast.error("No client data available to export");
      return;
    }

    const exportData = filteredUsers.map((user: any) => ({
      "User Name": user?.fullName || "---",
      Contact: user?.phoneNumber || "---",
      Email: user?.email || "---",
      Gender: user?.gender || "---",
      "Registration Date": formatDate(user?.createdAt),
      "Total Bookings": user?.totalBookings || 0,
      "Total Cancellation": user?.totalCancelled || 0,
      Status: user?.status === "Deactivated" ? "Blocked" : "Active",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(
      workbook,
      `client-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  console.log(users, isFetching);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const res = await deleteUser(id).unwrap();
    if (res?.success) {
      setDeleteId("");
      toast.success("Business deleted successfully");
    }
    setDeleteTarget(null);
  };

  const handleSet = (id: string) => {
    setId(id);
    setStatus("details");
  };

  return (
    <div>
      <UserOverview></UserOverview>
      <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
          <h1 className="md:font-medium">Client List</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
              placeholder="search by name or email.."
              type="text"
            />
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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
            <button
              onClick={() => refetch && refetch()}
              className="border border-gray-300 dark:border-slate-700 flex items-center justify-center gap-1 px-4 text-gray-600 dark:text-slate-200 rounded-[6px] cursor-pointer py-1 md:justify-start"
            >
              Refresh <RotateCw size={15}></RotateCw>
            </button>
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
                User Details
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead>Total Cancellation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => {
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
                    <TableCell>
                      {user?.phoneNumber} <br />{" "}
                      <p className="text-xs">{user?.email}</p>
                    </TableCell>
                    <TableCell>{user?.gender || "---"}</TableCell>
                    <TableCell>{formatDate(user?.createdAt)}</TableCell>
                    <TableCell>{user?.totalBookings || 0}</TableCell>
                    <TableCell>{user?.totalCancelled || 0}</TableCell>
                    <TableCell className="px-2 py-1">
                      <span
                        className={`px-2 py-1 rounded-xl text-sm font-medium ${
                          user?.status === "Inactive"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {/* {user.status == "Deactivated" ? "Blocked" : "Active"} */}
                        {user.status}
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
                            className="disabled:cursor-not-allowed cursor-pointer text-red-500 disabled:text-gray-500"
                            disabled={!editable}
                            onClick={() =>
                              setDeleteTarget({
                                id: user.id,
                                name: user?.fullName || "this user",
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
                title="Client"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>

        {filteredUsers.length > 0 && (
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
                This will permanently delete {deleteTarget?.name || "this user"}
                . This action cannot be undone.
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

export default AllUsers;
