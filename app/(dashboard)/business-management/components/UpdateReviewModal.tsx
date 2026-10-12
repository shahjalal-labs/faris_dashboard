"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";
import { Edit } from "lucide-react";
import { useUpdateReviewMutation } from "@/redux/api/reviewApi";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const UpdateReviewModal = ({ rating, comment, id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(String(rating ?? ""));
  const [commentValue, setCommentValue] = useState(comment ?? "");
  const [updateReview, { isLoading }] = useUpdateReviewMutation();
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  useEffect(() => {
    if (isOpen) {
      setRatingValue(String(rating ?? ""));
      setCommentValue(comment ?? "");
    }
  }, [isOpen, rating, comment]);

  const isChanged = useMemo(() => {
    return (
      ratingValue.trim() !== String(rating ?? "").trim() ||
      commentValue.trim() !== String(comment ?? "").trim()
    );
  }, [ratingValue, commentValue, rating, comment]);

  const isValidRating = useMemo(
    () => /^[1-5]$/.test(ratingValue.trim()),
    [ratingValue],
  );

  const handleUpdate = async () => {
    if (!isValidRating) {
      toast.error("Rating must be a whole number between 1 and 5");
      return;
    }

    const payload = {
      reviewId: id,
      rating: Number(ratingValue),
      comment: commentValue,
    };

    await updateReview(payload).unwrap();
    toast.success("Review updated successfully");
    setIsOpen(false);
  };

  return (
    <div>
      <button
        disabled={!editable}
        onClick={() => setIsOpen(true)}
        className="rounded-md  disabled:cursor-not-allowed py-2 text-gray-500 cursor-pointer text-sm "
      >
        <Edit></Edit>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-md rounded-lg bg-white dark:bg-slate-900 p-6 shadow-lg sm:max-w-lg"
          showCloseButton={false}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">
              Update Review
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close update review modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#636F85]">
                Rating
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={ratingValue}
                onChange={(e) => {
                  const nextValue = e.target.value.replace(/[^0-9]/g, "");
                  if (nextValue.length <= 1) {
                    setRatingValue(nextValue);
                  }
                }}
                className="w-full rounded-md border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-bprimary"
                placeholder="Enter rating (1-5)"
              />
              {!isValidRating && ratingValue.trim() !== "" && (
                <p className="mt-1 text-xs text-red-500">
                  Rating must be a whole number from 1 to 5.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#636F85]">
                Comment
              </label>
              <textarea
                rows={4}
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                className="w-full resize-none rounded-md border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-bprimary"
                placeholder="Enter comment"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={
                !isChanged ||
                isLoading ||
                !isValidRating ||
                !ratingValue.trim() ||
                !commentValue.trim()
              }
              className="w-full rounded-md bg-bprimary py-2 text-sm font-semibold text-white transition-colors hover:bg-bprimary/90 disabled:cursor-not-allowed disabled:bg-bprimary/40"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateReviewModal;
