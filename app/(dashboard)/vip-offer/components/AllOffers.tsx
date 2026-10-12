"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useRef, useState } from "react";
import { Calendar, Trash2, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import {
  useAllOffersQuery,
  useDeleteOfferMutation,
} from "@/redux/api/offerApi";
import Pagination from "@/components/Common/Pagination";
import { toast } from "sonner";
import OfferDetailsModal from "./OfferDetailsModal";
import EditOfferModal from "./EditOfferModal";
import regionList from "@/components/Common/Region.json";
import cityList from "@/components/Common/Cities.json";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
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
        month: "2-digit",
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
      className="relative flex h-10 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:w-[180px]"
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

const AllOffers = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteOffer] = useDeleteOfferMutation();

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const filteredCities = region
    ? cityList.filter((item) => item.region === region)
    : cityList;

  const {
    data: business,
    isLoading,
    isFetching,
  } = useAllOffersQuery({
    page,
    search: searchTerm,
    region,
    city,
    category,
  });
  const totalPage = business?.result?.meta?.totalPages;
  const offerRows = business?.result?.offers || [];

  const filteredOffers = useMemo(() => {
    return offerRows.filter((offer: any) => {
      if (!offer?.startDate) return false;

      const startDate = new Date(offer.startDate);
      if (Number.isNaN(startDate.getTime())) return false;

      const startDateOnly = startDate.toISOString().slice(0, 10);

      if (fromDate && startDateOnly < fromDate) return false;
      if (toDate && startDateOnly > toDate) return false;

      return true;
    });
  }, [offerRows, fromDate, toDate]);

  const displayedOffers = filteredOffers.slice().sort((a: any, b: any) => {
    const ta = a?.startDate ? new Date(a.startDate).getTime() : 0;
    const tb = b?.startDate ? new Date(b.startDate).getTime() : 0;
    if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
    if (sortOrder === "recent") return tb - ta; // newest first
    return ta - tb; // oldest first
  });

  const hanleDelete = async (id: string) => {
    const res = await deleteOffer(id).unwrap();
    if (res.success) {
      toast.success("Offer deleted successfully");
    }
    setDeleteTarget(null);
  };

  const handleExport = () => {
    if (!displayedOffers || displayedOffers.length === 0) {
      toast.error("No offer data available to export");
      return;
    }

    const exportData = displayedOffers.map((offer: any) => ({
      "Offer Name": offer?.serviceName || "---",
      "Business Name": offer?.provider?.fullName || "---",
      Category: offer?.serviceCategory || "---",
      Region: offer?.provider?.providerProfiles[0]?.region || "---",
      City: offer?.provider?.providerProfiles[0]?.city || "---",
      "Starting Date": offer?.startDate
        ? new Date(`${offer.startDate}T00:00:00`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "---",
      "End Date": offer?.endDate
        ? new Date(`${offer.endDate}T00:00:00`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "---",
      Bookings: offer?._count?.bookings || 0,
      Status:
        offer?.status === "Deactivated"
          ? "Rejected"
          : offer?.status === "Active"
            ? "Accepted"
            : "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offers");
    XLSX.writeFile(
      workbook,
      `offer-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <div>
      <h1 className="text-2xl pb-6 font-medium">Service Offers</h1>
      <div className="bg-white dark:bg-slate-900  p-5 rounded-xl">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
          <select
            value={region}
            onChange={(e) => {
              const selectedRegion = e.target.value;
              setRegion(selectedRegion);
              setCity("");
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 dark:bg-slate-800 bg-white text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
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
            className="border border-gray-300 dark:border-slate-700 dark:bg-slate-800 bg-white text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
          >
            <option value="">City</option>
            {filteredCities.map((item) => (
              <option key={`${item.region}-${item.name}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
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
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 dark:bg-slate-800 bg-white text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
          >
            <option value="">Category</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Both">Male & Female</option> */}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 pt-4 xl:grid-cols-[1fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border w-full border-gray-300 dark:border-slate-700 dark:bg-slate-800 bg-white text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
            placeholder="search by offer name"
            type="text"
          />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as "recent" | "oldest");
              setPage(1);
            }}
            className="border border-gray-300 dark:border-slate-700 dark:bg-slate-800 bg-white text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
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
      <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
        <div>
          <h1 className="md:font-medium pb-5 text-2xl">Offer List</h1>
        </div>

        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 dark:bg-slate-800">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                Offer Name
              </TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Starting Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayedOffers.length > 0 ? (
              displayedOffers.map((user: any) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex cursor-pointer items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user?.mediaUrl ||
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
                    <TableCell>
                      {user?.serviceCategory === "Male"
                        ? "Male"
                        : user?.serviceCategory === "Female"
                          ? "Female"
                          : user?.serviceCategory === "Both"
                            ? "Male & Female"
                            : "---"}
                    </TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles[0]?.region}
                    </TableCell>
                    <TableCell>
                      {user?.provider?.providerProfiles[0]?.city}
                    </TableCell>
                    <TableCell>
                      {user?.startDate
                        ? new Date(
                            `${user.startDate}T00:00:00`,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "---"}
                    </TableCell>
                    <TableCell>
                      {user?.endDate
                        ? new Date(
                            `${user.endDate}T00:00:00`,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "---"}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        if (!user?.startDate || !user?.endDate) return "-";
                        const start = new Date(user.startDate);
                        const end = new Date(user.endDate);

                        const diffTime = end.getTime() - start.getTime();
                        const diffDays =
                          Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        return `${diffDays} days`;
                      })()}
                    </TableCell>
                    <TableCell>{user?._count?.bookings || 0}</TableCell>
                    <TableCell className="px-2 py-1">
                      <span
                        className={`px-4 py-1 rounded-[7px] text-sm font-medium ${
                          user?.status === "Pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : user?.status === "Active"
                              ? "bg-green-50 text-green-600"
                              : user?.status === "Deactivated"
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {user.status === "Deactivated"
                          ? "Rejected"
                          : user?.status == "Active"
                            ? "Accepted"
                            : "Pending"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <OfferDetailsModal id={user.id}></OfferDetailsModal>
                        <EditOfferModal id={user.id}></EditOfferModal>
                        <button
                          disabled={!editable}
                          className="text-red-500 disabled:cursor-not-allowed cursor-pointer disabled:text-gray-700"
                          onClick={() =>
                            setDeleteTarget({
                              id: user.id,
                              name: user?.serviceName || "this offer",
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
                title="Offer"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>

        {displayedOffers.length > 0 && (
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
                {deleteTarget?.name || "this offer"}. This action cannot be
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
    </div>
  );
};

export default AllOffers;
