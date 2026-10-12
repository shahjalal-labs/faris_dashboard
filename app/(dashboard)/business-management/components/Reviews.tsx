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
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";

import { FaStar } from "react-icons/fa";
import { useBusinessProfileQuery } from "@/redux/api/business.Api";
import ReviewDetailsModal from "./ReviewDetailsModal";
import { useDeleteReviewMutation } from "@/redux/api/reviewApi";
import { toast } from "sonner";
import UpdateReviewModal from "./UpdateReviewModal";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const Reviews = ({ id }: any) => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [searchTerm, setSearchTerm] = useState(searchData);
  const [sortBy, setSortBy] = useState("recent");

  const { data: business, isLoading, isFetching } = useBusinessProfileQuery(id);
  const [deleteReview] = useDeleteReviewMutation();
  const reviews = business?.result?.receivedReviews || [];

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const filteredReviews = reviews.filter((review: any) => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return true;

    const clientName = (review?.user?.fullName || "").toLowerCase();
    const comment = (review?.comment || "").toLowerCase();

    return clientName.includes(term) || comment.includes(term);
  });

  const filteredAndSortedReviews = [...filteredReviews].sort(
    (a: any, b: any) => {
      const aTime = new Date(a?.createdAt).getTime() || 0;
      const bTime = new Date(b?.createdAt).getTime() || 0;

      if (sortBy === "oldest") return aTime - bTime;
      return bTime - aTime;
    },
  );

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteReview(reviewId).unwrap();
    if (res?.success) {
      toast.success("Review deleted successfully");
    } else {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-5 my-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Client Reviews & Feedback</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by client name or comment.."
            type="text"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Client Name
            </TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAndSortedReviews?.length > 0 ? (
            filteredAndSortedReviews.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.user?.profileImage ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.user?.fullName}
                        />
                        <AvatarFallback>{user?.user?.fullName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {user?.user?.fullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.service?.serviceName || user?.offer?.serviceName}
                  </TableCell>
                  <TableCell>
                    {new Date(user?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{user?.comment}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <FaStar className="text-[#FAAD14]" /> {user?.rating}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ReviewDetailsModal review={user}></ReviewDetailsModal>
                      <UpdateReviewModal
                        rating={user?.rating}
                        comment={user?.comment}
                        id={user?.id}
                      ></UpdateReviewModal>
                      <button
                        disabled={!editable}
                        className="text-red-500 disabled:cursor-not-allowed disabled:text-gray-700"
                        onClick={() => handleDeleteReview(user.id)}
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
              title="Review"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Reviews;
