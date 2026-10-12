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

import {
  useAllbookingsQuery,
  useDeleteBookingMutation,
} from "@/redux/api/bookingApi";
import { Download, SaudiRiyal, Trash2, Loader } from "lucide-react";
import Pagination from "../Common/Pagination";
import React, { useMemo, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import UserBookingDetailsModal from "@/app/(dashboard)/client-management/components/UserBookingDetailsModal";
import regionList from "@/components/Common/Region.json";
import cityList from "@/components/Common/Cities.json";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const AllRecentActivities = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [draftMinPrice, setDraftMinPrice] = useState("0");
  const [draftMaxPrice, setDraftMaxPrice] = useState("0");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const filteredCities = region
    ? cityList.filter((item) => item.region === region)
    : cityList;

  const fromInputRef = useRef<HTMLInputElement | null>(null);
  const toInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: business,
    isLoading,
    isFetching,
  } = useAllbookingsQuery({
    page,
    limit: 10,
    search: searchTerm,
    region,
    city,
    category,
    status,
  });
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [deleteId, setDeleteId] = useState("");

  const handleDelete = async (id: string) => {
    try {
      setDeleteId(id);
      const res = await (deleteBooking(id) as any).unwrap?.();
      if (res?.success) {
        toast.success("Booking deleted successfully");
      } else {
        toast.success("Booking deleted");
      }
    } catch (err) {
      toast.error("Failed to delete booking");
    } finally {
      setDeleteId("");
      setDeleteTarget(null);
    }
  };

  const totalPage = business?.result?.meta?.totalPages;
  const bookingRows = business?.result?.bookings || [];
  const priceBounds = useMemo(() => {
    const prices = bookingRows
      .map((booking: any) => Number(booking?.price))
      .filter((price: number) => !Number.isNaN(price));

    const max = prices.length > 0 ? Math.max(...prices) : 0;
    return {
      min: 0,
      max: Math.ceil(max),
    };
  }, [bookingRows]);

  React.useEffect(() => {
    if (!isPriceFilterOpen && maxPrice === "" && priceBounds.max > 0) {
      setDraftMinPrice("0");
      setDraftMaxPrice(String(priceBounds.max));
    }
  }, [isPriceFilterOpen, maxPrice, priceBounds.max]);

  React.useEffect(() => {
    if (draftMaxPrice === "0" && priceBounds.max > 0) {
      setDraftMaxPrice(String(priceBounds.max));
    }
  }, [draftMaxPrice, priceBounds.max]);

  const filteredBookings = useMemo(() => {
    return bookingRows.filter((booking: any) => {
      if (!booking?.createdAt) return false;

      const servicePrice = Number(booking?.price);
      if (
        minPrice &&
        (Number.isNaN(servicePrice) || servicePrice < Number(minPrice))
      ) {
        return false;
      }
      if (
        maxPrice &&
        (Number.isNaN(servicePrice) || servicePrice > Number(maxPrice))
      ) {
        return false;
      }

      const createdAtDate = new Date(booking.createdAt);
      if (Number.isNaN(createdAtDate.getTime())) return false;
      const createdAtOnly = createdAtDate.toISOString().slice(0, 10);

      if (fromDate && createdAtOnly < fromDate) return false;
      if (toDate && createdAtOnly > toDate) return false;

      return true;
    });
  }, [bookingRows, fromDate, maxPrice, minPrice, toDate]);

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
    if (filteredBookings.length === 0) {
      toast.error("No booking data available to export");
      return;
    }

    const exportData = filteredBookings.map((user: any) => ({
      "Service Name":
        user?.service?.serviceName || user?.offer?.serviceName || "---",
      "Client Name": user?.user?.fullName || "---",
      "Business Name": user?.provider?.fullName || "---",
      Category:
        user?.service?.serviceCategory || user?.offer?.serviceCategory || "---",
      Appointment: `${formatDate(user?.createdAt)} / ${user?.time || "---"}`,
      Region: user?.provider?.providerProfiles?.[0]?.region || "---",
      City: user?.provider?.providerProfiles?.[0]?.city || "---",
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
    <div>
      <h1 className="text-xl font-medium">Recent Activities</h1>
      <p className="text-[#636F85] pb-5">
        Admin View – Manage and monitor your top performing services
      </p>
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <select
            value={region}
            onChange={(e) => {
              const selectedRegion = e.target.value;
              setRegion(selectedRegion);
              setCity("");
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
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
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
          >
            <option value="">City</option>
            {filteredCities.map((item) => (
              <option key={`${item.region}-${item.name}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <label
            onClick={() => {
              if (fromInputRef.current?.showPicker) {
                fromInputRef.current.showPicker();
                return;
              }
              fromInputRef.current?.click();
            }}
            className="relative flex h-10 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
          >
            <span
              className={
                fromDate
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400"
              }
            >
              {fromDate
                ? new Date(`${fromDate}T00:00:00`).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "From Date"}
            </span>
            <Calendar className="ml-auto h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              ref={fromInputRef}
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>

          <label
            onClick={() => {
              if (toInputRef.current?.showPicker) {
                toInputRef.current.showPicker();
                return;
              }
              toInputRef.current?.click();
            }}
            className="relative flex h-10 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
          >
            <span
              className={
                toDate
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400"
              }
            >
              {toDate
                ? new Date(`${toDate}T00:00:00`).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "To Date"}
            </span>
            <Calendar className="ml-auto h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              ref={toInputRef}
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-2"
          >
            <option value="">Category</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Both">Both</option> */}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 xl:col-span-1"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setDraftMinPrice(minPrice || "0");
              setDraftMaxPrice(maxPrice || String(priceBounds.max || 0));
              setIsPriceFilterOpen(true);
            }}
            className="h-10  items-center justify-center gap-2 rounded-[6px] border border-gray-300 bg-white px-3 text-sm font-medium text-slate-900 cursor-pointer hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 "
          >
            Service Price
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-slate-900 outline-none placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            placeholder="search by service, client, or business.."
            type="text"
          />

          <button
            disabled={!editable}
            type="button"
            onClick={handleExport}
            className="h-10 inline-flex w-full items-center justify-center gap-1 rounded-[6px] border border-bprimary bg-bprimary px-4 text-white cursor-pointer disabled:cursor-not-allowed xl:w-auto dark:border-emerald-500 dark:bg-emerald-600"
          >
            Export <Download size={15} />
          </button>
        </div>
      </div>

      <Dialog open={isPriceFilterOpen} onOpenChange={setIsPriceFilterOpen}>
        <DialogContent className="max-w-[420px] border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">
              Price Filter
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Select the service price range you want to view.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Price</span>
                <span>
                  {Number(draftMinPrice || 0).toLocaleString()} -{" "}
                  {Number(draftMaxPrice || 0).toLocaleString()}
                </span>
              </div>

              <div className="relative pt-4">
                <div className="absolute left-0 right-0 top-8 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div
                  className="absolute top-8 h-1 rounded-full bg-emerald-500"
                  style={{
                    left: `${
                      priceBounds.max > 0
                        ? (Math.min(
                            Number(draftMinPrice || 0),
                            Number(draftMaxPrice || 0),
                          ) /
                            priceBounds.max) *
                          100
                        : 0
                    }%`,
                    right: `${
                      priceBounds.max > 0
                        ? 100 -
                          (Math.max(
                            Number(draftMinPrice || 0),
                            Number(draftMaxPrice || 0),
                          ) /
                            priceBounds.max) *
                            100
                        : 0
                    }%`,
                  }}
                />

                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max || 1}
                  step="1"
                  value={Math.min(
                    Number(draftMinPrice || 0),
                    Number(draftMaxPrice || 0),
                  )}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);
                    const upperValue = Number(
                      draftMaxPrice || priceBounds.max || 0,
                    );
                    setDraftMinPrice(String(Math.min(nextValue, upperValue)));
                  }}
                  className="pointer-events-none absolute left-0 top-4 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:bg-white"
                />

                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max || 1}
                  step="1"
                  value={Math.max(
                    Number(draftMinPrice || 0),
                    Number(draftMaxPrice || 0),
                  )}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);
                    const lowerValue = Number(draftMinPrice || 0);
                    setDraftMaxPrice(String(Math.max(nextValue, lowerValue)));
                  }}
                  className="pointer-events-none absolute left-0 top-4 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Min Price
                </label>
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max || 1}
                  value={draftMinPrice}
                  onChange={(e) => setDraftMinPrice(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Max Price
                </label>
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max || 1}
                  value={draftMaxPrice}
                  onChange={(e) => setDraftMaxPrice(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => {
                setDraftMinPrice(String(priceBounds.min));
                setDraftMaxPrice(String(priceBounds.max || 0));
                setMinPrice("");
                setMaxPrice("");
                setIsPriceFilterOpen(false);
              }}
              className="h-10 rounded-[6px] border border-gray-300 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMin = String(
                  Math.max(
                    priceBounds.min,
                    Math.min(
                      Number(draftMinPrice || 0),
                      Number(draftMaxPrice || 0),
                    ),
                  ),
                );
                const nextMax = String(
                  Math.max(
                    Number(nextMin),
                    Math.max(
                      Number(draftMinPrice || 0),
                      Number(draftMaxPrice || 0),
                    ),
                  ),
                );
                setMinPrice(nextMin);
                setMaxPrice(nextMax);
                setPage(1);
                setIsPriceFilterOpen(false);
              }}
              className="h-10 rounded-[6px] bg-bprimary px-4 text-sm font-medium text-white dark:bg-emerald-600"
            >
              Apply
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
        <h1 className="md:font-medium pb-4 text-slate-900 dark:text-slate-100">
          Recent Activities
        </h1>

        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-200 dark:bg-slate-800">
            <TableRow>
              <TableHead className="w-[150px] whitespace-nowrap">
                Service Name
              </TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Service Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((user: any) => {
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
                          {user?.service?.serviceName ||
                            user?.offer?.serviceName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user?.user?.fullName || "---"}</TableCell>
                    <TableCell>{user?.provider?.fullName || "---"}</TableCell>
                    <TableCell>
                      {user?.service?.serviceCategory ||
                        user?.offer?.serviceCategory ||
                        "---"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <p>{formatDate(user?.createdAt)}</p>/<p>{user?.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles?.[0]?.region || "---"}
                    </TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles?.[0]?.city || "---"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <SaudiRiyal></SaudiRiyal>
                        <p>{user?.price}</p>
                      </div>
                    </TableCell>
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
                          city={user.provider?.providerProfiles?.[0]?.city}
                          region={user.provider?.providerProfiles?.[0]?.region}
                        ></UserBookingDetailsModal>
                        {isDeleting && deleteId === user.id ? (
                          <Loader className="animate-spin text-red-500" />
                        ) : (
                          <button
                            disabled={!editable}
                            className="disabled:cursor-not-allowed text-red-500"
                            onClick={() =>
                              setDeleteTarget({
                                id: user.id,
                                name:
                                  user?.service?.serviceName ||
                                  user?.provider?.fullName ||
                                  "this booking",
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
                title="Activity"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
        {filteredBookings.length > 0 && (
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
                This will permanently delete this booking. This action cannot be
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

export default AllRecentActivities;
