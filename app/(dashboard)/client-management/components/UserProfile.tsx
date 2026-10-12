"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlockUnblockMutation,
  useGetMyProfileQuery,
  useUserDetailsQuery,
} from "@/redux/api/authApi";
import { toast } from "sonner";

interface ProfileFieldProps {
  label: string;
  value?: string | null;
}

const ProfileField = ({ label, value }: ProfileFieldProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-slate-800">
      <div className="text-sm font-medium text-gray-600 dark:text-slate-400">
        {label}
      </div>
      <div className="text-sm text-gray-900 dark:text-slate-100">
        {value || (
          <span className="text-gray-400 dark:text-slate-500 italic">
            Not provided
          </span>
        )}
      </div>
    </div>
  );
};

const getStatusClass = (status?: string) => {
  if (status === "Active") return "text-green-600 bg-green-50";
  if (status === "Pending") return "text-yellow-600 bg-yellow-50";
  if (status === "Deactivated") return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-50";
};

const UserProfile = ({ id }: any) => {
  const [blockUnblock, { isLoading: isBlockUnblockLoading }] =
    useBlockUnblockMutation();
  const { data: business, isLoading, isError } = useUserDetailsQuery(id);
  const businessData = business?.result;

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const hanldeBlockUnblock = async () => {
    const res = await blockUnblock(id).unwrap();
    if (res?.success) {
      toast.success(
        `Client has been ${businessData?.status !== "Deactivated" ? "blocked" : "unblocked"} successfully`,
      );
    }
  };

  if (isLoading) return <Skeleton className="w-full mt-6 h-96" />;
  if (isError || !businessData)
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load client profile
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg shadow p-6 mt-8 space-y-6">
      <div className="flex justify-between items-center my-6">
        <h2 className="md:text-lg font-semibold text-gray-800 dark:text-slate-100">
          Profile Information
        </h2>
        <button
          onClick={() => hanldeBlockUnblock()}
          className={`${
            businessData?.status !== "Deactivated"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-bprimary"
          } text-white py-1 px-4 disabled:cursor-not-allowed rounded`}
          disabled={isBlockUnblockLoading || !editable}
        >
          {businessData?.status !== "Deactivated"
            ? `${isBlockUnblockLoading ? "Blocking..." : "Block"}`
            : `${isBlockUnblockLoading ? "Unblocking..." : "Unblock"}`}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 items-center border-b border-gray-200 dark:border-slate-800">
        <div className="text-sm font-medium text-gray-600 dark:text-slate-400">
          Profile Image
        </div>
        <div>
          {businessData?.profileImage ? (
            <img
              src={businessData?.profileImage}
              alt={businessData?.fullName || "Client profile"}
              className="h-20 w-20 rounded-full object-cover border border-gray-300 dark:border-slate-700"
            />
          ) : (
            <span className="text-gray-400 dark:text-slate-500 italic">
              Not provided
            </span>
          )}
        </div>
      </div>

      <ProfileField label="Full Name" value={businessData?.fullName} />
      <ProfileField label="Email" value={businessData?.email} />
      <ProfileField label="Phone Number" value={businessData?.phoneNumber} />
      <ProfileField label="Gender" value={businessData?.gender} />
      <ProfileField label="User ID" value={businessData?.id} />
      <ProfileField
        label="Created At"
        value={
          businessData?.createdAt
            ? new Date(businessData?.createdAt).toLocaleDateString()
            : null
        }
      />

      <div className="grid grid-cols-2 gap-4 py-3">
        <div className="text-sm font-medium text-gray-600 dark:text-slate-400">
          Status
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-[6px] font-semibold text-sm ${getStatusClass(
              businessData?.status,
            )}`}
          >
            {businessData?.status == "Deactivated"
              ? "Blocked"
              : businessData?.status || "Not provided"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
