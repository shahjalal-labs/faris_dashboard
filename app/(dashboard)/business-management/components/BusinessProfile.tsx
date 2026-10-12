"use client";

import { useState } from "react";
import { useBusinessProfileQuery } from "@/redux/api/business.Api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlockUnblockMutation,
  useGetMyProfileQuery,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import UpdateBusinessModal from "./UpdateBusinessModal";

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

interface ImageFieldProps {
  label: string;
  imageUrl?: string | null;
  onClick?: () => void;
}

const ImageField = ({ label, imageUrl, onClick }: ImageFieldProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 items-center py-3 border-b border-gray-200 dark:border-slate-800">
      <div className="text-sm font-medium text-gray-600 dark:text-slate-400">
        {label}
      </div>
      <div className="text-sm">
        {imageUrl ? (
          <button
            type="button"
            onClick={onClick}
            className="inline-block cursor-pointer"
            aria-label={`Open ${label} image`}
          >
            <img
              src={imageUrl}
              alt={label}
              className="h-24 w-24 rounded border border-gray-300 object-cover dark:border-slate-700"
            />
          </button>
        ) : (
          <span className="text-gray-400 dark:text-slate-500 italic">
            Not provided
          </span>
        )}
      </div>
    </div>
  );
};

const BusinessProfile = ({ id }: any) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [blockUnblock, { isLoading: isBlockUnblockLoading }] =
    useBlockUnblockMutation();
  const { data: business, isLoading, isError } = useBusinessProfileQuery(id);
  const businessData = business?.result;

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  if (isLoading) return <Skeleton className="w-full mt-6 h-96" />;
  if (isError || !businessData)
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load business profile
      </div>
    );

  const providerProfile = businessData?.providerProfiles?.[0];

  const hanldeBlockUnblock = async () => {
    const res = await blockUnblock(id).unwrap();
    if (res?.success) {
      toast.success(
        `Business has been ${businessData?.status !== "Deactivated" ? "blocked" : "unblocked"} successfully`,
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg shadow p-6 mt-8 space-y-8">
      {/* Basic Information */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="md:text-lg font-semibold text-gray-800 dark:text-slate-100">
            Profile Information
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => hanldeBlockUnblock()}
              className={`${
                businessData?.status !== "Deactivated"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-bprimary"
              } text-white py-1 disabled:cursor-not-allowed px-4 rounded`}
              disabled={isBlockUnblockLoading || !editable}
            >
              {businessData?.status !== "Deactivated"
                ? `${isBlockUnblockLoading ? "Blocking..." : "Block"}`
                : `${isBlockUnblockLoading ? "Unblocking..." : "Unblock"}`}
            </button>
            <UpdateBusinessModal business={businessData}></UpdateBusinessModal>
          </div>
        </div>
        <ProfileField label="Business Name" value={businessData?.fullName} />
        <ProfileField label="Email" value={businessData?.email} />
        <ProfileField label="Phone Number" value={businessData?.phoneNumber} />
        <ProfileField label="Gender" value={businessData?.gender} />
        <ProfileField
          label="Created At"
          value={
            businessData?.createdAt
              ? new Date(businessData.createdAt).toLocaleDateString()
              : null
          }
        />
      </div>

      {/* Business Verification (from providerProfiles) */}
      {providerProfile && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-100">
            Business Verification
          </h2>

          <ProfileField
            label="Service Type"
            value={
              providerProfile?.serviceType == "Grooming"
                ? "Grooming Center"
                : providerProfile?.serviceType == "Aesthetic"
                  ? "Aesthetic Clinic"
                  : providerProfile?.serviceType == "Spa"
                    ? "Spa & Massage"
                    : providerProfile?.serviceType
            }
          />
          <ProfileField
            label="Service Category"
            value={providerProfile?.serviceCategory}
          />
          <ProfileField label="Region" value={providerProfile?.region} />
          <ProfileField label="City" value={providerProfile?.city} />
          <ProfileField
            label="Description"
            value={providerProfile?.salonDescription}
          />
          <ProfileField
            label="Additional Note"
            value={providerProfile?.additionalNote}
          />
          <ProfileField label="NID Note" value={providerProfile?.nidNote} />
          <ProfileField
            label="Optional Note"
            value={providerProfile?.optionalNote}
          />
        </div>
      )}

      {/* Verification Documents */}
      {providerProfile && (
        <div>
          <ProfileField label="VAT Number" value={businessData?.vatNo} />
          <ImageField
            label="VAT Certification"
            imageUrl={providerProfile?.vatUrl}
            onClick={() => setPreviewImage(providerProfile?.vatUrl || null)}
          />
          <ImageField
            label="NID Image"
            imageUrl={providerProfile?.nidUrl}
            onClick={() => setPreviewImage(providerProfile?.nidUrl || null)}
          />
          <ImageField
            label="Logo"
            imageUrl={providerProfile?.logo}
            onClick={() => setPreviewImage(providerProfile?.logo || null)}
          />
          <ImageField
            label="Additional Photo"
            imageUrl={providerProfile?.additionalPhoto}
            onClick={() =>
              setPreviewImage(providerProfile?.additionalPhoto || null)
            }
          />
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;
