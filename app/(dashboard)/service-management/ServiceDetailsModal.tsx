"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ImageIcon } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SkeletonCard } from "@/components/Common/Skeleton";
import {
  useDeleteServiceMutation,
  useServiceDetailsQuery,
} from "@/redux/api/serviceApi";
import { toast } from "sonner";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center border-b border-gray-100 dark:border-slate-800 py-4">
      <p className="text-sm text-gray-600 dark:text-slate-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-slate-100 text-right font-medium wrap-break-word">
        {value}
      </p>
    </div>
  );
};

const ServiceDetailsModal = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useServiceDetailsQuery(id, { skip: !isOpen });
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const service = data?.result;

  const router = useRouter();

  const hanleDelete = async () => {
    const res = await deleteService(id).unwrap();
    if (res.success) {
      toast.success("Service deleted successfully");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md py-2 text-yellow-500 cursor-pointer text-sm"
        aria-label="Open service details"
      >
        <Eye />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[700px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex justify-between  gap-48 items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Service Details
              </h2>
              <button
                onClick={() => {
                  const businessName = service?.provider?.fullName;
                  if (!businessName) {
                    toast.error("Business name unavailable");
                    return;
                  }
                  router.push(
                    `/business-management?search=${encodeURIComponent(
                      businessName,
                    )}`,
                  );
                  setIsOpen(false);
                }}
                className="border cursor-pointer px-2 py-1 rounded-[5px]"
              >
                Business
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close service details modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="px-6 py-3 max-h-[58vh] overflow-y-auto">
            {isLoading ? (
              <SkeletonCard height={360} />
            ) : (
              <div>
                <DetailRow
                  label="Service Name"
                  value={service?.serviceName || "N/A"}
                />
                <DetailRow
                  label="Business Name"
                  value={service?.provider?.fullName || "N/A"}
                />
                <DetailRow
                  label="Service Category"
                  value={service?.serviceCategory || "N/A"}
                />
                <DetailRow
                  label="Duration time"
                  value={service?.duration || "N/A"}
                />
                <DetailRow
                  label="Service Price"
                  value={
                    typeof service?.servicePrice === "number"
                      ? `${service.servicePrice} SAR`
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Service Mode"
                  value={
                    service?.serviceMode == "Online"
                      ? "In-center"
                      : "Out-of-center"
                  }
                />

                <div className="grid grid-cols-[180px_1fr] items-center border-b border-gray-100 dark:border-slate-800 py-4">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Short Description
                  </p>
                  <p className="text-sm text-gray-900 dark:text-slate-100 text-right font-medium leading-6">
                    {service?.description || "N/A"}
                  </p>
                </div>

                <div className="grid grid-cols-[180px_1fr] items-center py-4">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Service Image
                  </p>
                  <div className="flex justify-end">
                    {service?.url1 ? (
                      <img
                        src={service.url1}
                        alt={service?.serviceName || "Service image"}
                        className="h-[86px] w-[150px] rounded-xl border border-gray-200 dark:border-slate-700 object-cover"
                      />
                    ) : (
                      <div className="flex h-[86px] w-[150px] items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                        <ImageIcon size={30} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex mb-6 justify-end pr-6 gap-3">
            <button
              onClick={() => hanleDelete()}
              disabled={isDeleting}
              className="bg-red-50 disabled:bg-gray-600 text-red-500 px-7 py-2 rounded-2xl"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetailsModal;
