"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useAcceptRejectOfferMutation,
  useOfferDetailsQuery,
} from "@/redux/api/offerApi";
import { SkeletonCard } from "@/components/Common/Skeleton";
import { toast } from "sonner";

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-CA");
};

const formatTime = (time?: string) => {
  if (!time) return "N/A";
  const [hourPart, minutePart] = time.split(":");
  const hours = Number(hourPart);
  const minutes = Number(minutePart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "N/A";

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getTimeline = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "N/A";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "N/A";

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${diffDays} days`;
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 dark:border-slate-800 py-3">
      <p className="text-sm text-gray-600 dark:text-slate-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-slate-100 text-right font-medium wrap-break-word">
        {value}
      </p>
    </div>
  );
};

const OfferDetailsModal = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useOfferDetailsQuery({ id }, { skip: !isOpen });
  const [acceptRejectOffer, { isLoading: isAcceptingRejecting }] =
    useAcceptRejectOfferMutation();

  const offer = data?.result;
  const profile = offer?.provider?.providerProfiles?.[0];

  const handleAcceptReject = async (isAccepted: boolean) => {
    const payload = {
      offerId: id,
      isAccepted,
    };

    const res = await acceptRejectOffer(payload).unwrap();

    if (res.success) {
      toast.success(res.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md py-2 text-yellow-500 cursor-pointer text-sm"
        aria-label="Open offer details"
      >
        <Eye />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[680px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {offer?.serviceName} Offer
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close offer details modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="px-6 pb-6 pt-2 max-h-[58vh] overflow-y-auto">
            {isLoading ? (
              <SkeletonCard height={420} />
            ) : (
              <div>
                <DetailRow
                  label="Offer Name"
                  value={offer?.serviceName || "N/A"}
                />
                <DetailRow
                  label="Business Name"
                  value={offer?.provider?.fullName || "N/A"}
                />
                <DetailRow
                  label="Service Type"
                  value={
                   offer?.serviceCategory || "N/A"
                  }
                />
                <DetailRow
                  label="Description"
                  value={offer?.description || "N/A"}
                />
                <DetailRow label="Region" value={profile?.region || "N/A"} />
                <DetailRow label="City" value={profile?.city || "N/A"} />
                <DetailRow
                  label="Offer Price"
                  value={
                    typeof offer?.servicePrice === "number"
                      ? `${offer.servicePrice}`
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Start of Offer"
                  value={formatDate(offer?.startDate)}
                />
                <DetailRow
                  label="End of Offer"
                  value={formatDate(offer?.endDate)}
                />
                <DetailRow
                  label="Timeline"
                  value={getTimeline(offer?.startDate, offer?.endDate)}
                />
                <DetailRow
                  label="Booking"
                  value={offer?._count?.bookings ?? 0}
                />
                <DetailRow
                  label="Location of Offer"
                  value={
                    offer?.location == "Online" ? "In-center" : "Out-of-center"
                  }
                />
                <DetailRow
                  label="Status"
                  value={
                    offer?.status == "Deactivated"
                      ? "Rejected"
                      : offer?.status || "N/A"
                  }
                />

                <div className="border-b border-gray-100 dark:border-slate-800 py-3">
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                    Offer Time:
                  </p>
                  <div className="grid grid-cols-[160px_1fr] items-center py-1">
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Start:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-slate-100 text-right font-medium">
                      {formatTime(offer?.startTime)}
                    </p>
                  </div>
                  <div className="grid grid-cols-[160px_1fr] items-center py-1">
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      End:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-slate-100 text-right font-medium">
                      {formatTime(offer?.endTime)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center py-3">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Service Image
                  </p>
                  <div className="flex justify-end">
                    <div
                      className="h-[88px] w-[150px] rounded-xl border border-gray-200 dark:border-slate-700 bg-cover bg-center bg-no-repeat dark:bg-slate-800"
                      style={{
                        backgroundImage: offer?.mediaUrl
                          ? `url(${offer.mediaUrl})`
                          : "none",
                        backgroundColor: offer?.mediaUrl
                          ? "transparent"
                          : "var(--color-fallback, #f3f4f6)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {offer?.status === "Pending" && (
            <div className="flex gap-6 justify-end mb-4 pr-6">
              <button
                disabled={isAcceptingRejecting}
                onClick={() => handleAcceptReject(false)}
                className="text-red-500 disabled:bg-gray-500 cursor-pointer text-sm bg-red-50 px-6 py-2 rounded-2xl"
              >
                Reject
              </button>
              <button
                disabled={isAcceptingRejecting}
                onClick={() => handleAcceptReject(true)}
                className="text-white cursor-pointer disabled:bg-gray-500 text-sm bg-bprimary px-6 py-2 rounded-2xl"
              >
                Accept
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferDetailsModal;
