"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { Eye } from "lucide-react";

const ReviewDetailsModal = ({ review }: { review: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const clientName = review?.user?.fullName || review?.userName || "N/A";
  const serviceName =
    review?.service?.serviceName || review?.offer?.serviceName || "N/A";
  const reviewDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const rating = review?.rating ?? "N/A";
  const comment = review?.comment || "N/A";

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md py-2 text-yellow-500 cursor-pointer text-sm "
      >
        <Eye></Eye>
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-md rounded-lg bg-white dark:bg-slate-900 p-6 shadow-lg sm:max-w-lg"
          showCloseButton={false}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">Review</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close review modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-[#636F85] font-medium">
                Client Name
              </span>
              <span className="text-sm text-[#2D2D2D] font-medium">
                {clientName}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-[#636F85] font-medium">
                Service Name
              </span>
              <span className="text-sm text-[#2D2D2D] font-medium">
                {serviceName}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-[#636F85] font-medium">Rating</span>
              <div className="flex items-center gap-1">
                <FaStar className="text-[#FAAD14]" size={16} />
                <span className="text-sm text-[#2D2D2D] font-medium">
                  {rating}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="text-sm text-[#636F85] font-medium">Date</span>
              <span className="text-sm text-[#2D2D2D] font-medium">
                {reviewDate}
              </span>
            </div>
            <div>
              <h1>Comment</h1>
              <h1 className="border px-2  py-4 mt-2 w-full rounded-xl text-gray-600 dark:text-slate-400">
                {" "}
                {comment}
              </h1>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewDetailsModal;
