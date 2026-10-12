"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";
import { Eye } from "lucide-react";
import { useAcceptRejectBookingMutation } from "@/redux/api/bookingApi";
import { toast } from "sonner";

const formatBookingDate = (value: string) => {
  if (!value) return "---";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const UserBookingDetailsModal = ({
  id,
  serviceName,
  businessName,
  date,
  time,
  status,
  price,
  city,
  region,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const [acceptReject, { isLoading: isAcceptRejecting }] =
    useAcceptRejectBookingMutation();

  const handleAcceptReject = async (isAccepted: boolean) => {
    const payload = {
      isAccepted,
      bookingId: id,
    };
    await acceptReject(payload).unwrap();
    toast.success(
      isAccepted
        ? "Booking accepted successfully"
        : "Booking rejected successfully",
    );
  };

  return (
    <>
      {/* View Details Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md  px-4 py-2 text-yellow-500 cursor-pointer text-sm "
      >
        <Eye></Eye>
      </button>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-md rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Booking
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <IoClose size={24} />
            </button>
          </div>
          {/* Details Section */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Service
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {serviceName}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Business Name
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {businessName}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Price
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {price}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Booking Date
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {formatBookingDate(date)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Booking Time
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {time}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                City
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {city}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Region
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                {region}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Service Duration
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                2 Hours
              </span>
            </div>

            <div className="flex justify-between items-center pb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Status
              </span>
              <span
                className={`px-4 py-1 rounded-[7px] text-sm font-medium ${
                  status === "Pending"
                    ? "bg-yellow-50 text-yellow-600"
                    : status === "Cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {status === "Pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => handleAcceptReject(false)}
                disabled={isAcceptRejecting || status !== "Pending"}
                className="flex-1 rounded-full bg-red-50 text-red-400 font-semibold py-2 hover:bg-red-200 transition-colors text-sm"
              >
                {isAcceptRejecting ? "Rejecting..." : "Reject Booking"}
              </button>
              <button
                onClick={() => handleAcceptReject(true)}
                className="flex-1 rounded-full bg-bprimary text-white font-semibold py-2 hover:bg-bprimary/90 transition-colors text-sm"
                disabled={isAcceptRejecting || status !== "Pending"}
              >
                {isAcceptRejecting ? "Accepting..." : "Accept Booking"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserBookingDetailsModal;
