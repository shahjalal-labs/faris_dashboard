"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useAdminQuery,
  useDeleteAdminMutation,
  useGetMyProfileQuery,
} from "@/redux/api/authApi";
import { LayoutGrid } from "lucide-react";
import { toast } from "sonner";

interface AdminDetailsModalProps {
  id: string;
  adminName: string;
  profileImage?: string | null;
}

const fallbackImage =
  "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png";

const pageOptions = [
  { key: "dashboard", label: "Dashboard" },
  { key: "cm", label: "Client Management" },
  { key: "bm", label: "Business Management" },
  { key: "sm", label: "Service Management" },
  { key: "vo", label: "VIP Offer" },
  { key: "cr", label: "Cancellation Reason" },
  { key: "earnings", label: "Earnings" },
  { key: "in", label: "Insights" },
  { key: "bbm", label: "Barber Messages" },
  { key: "aic", label: "Activation & Inactive Clients" },
] as const;

const AdminDetailsModal = ({
  id,
  adminName,
  profileImage,
}: AdminDetailsModalProps) => {
  const { data, isLoading, isError } = useAdminQuery(id, {
    skip: !id,
  });

  const [delteAdmin, { isLoading: isDeleteLoading }] = useDeleteAdminMutation();
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const report = data?.result;

  const handleDelete = async (id: string) => {
    const res = await delteAdmin(id).unwrap();
    if (res.success) {
      toast.success("Admin deleted successfully");
    }
  };

  const enabledAccessibility = [
    report?.editing ? "Editing" : null,
    report?.viewing ? "Viewing" : null,
  ].filter(Boolean) as string[];

  const enabledPages = pageOptions
    .filter((page) => Boolean(report?.[page.key]))
    .map((page) => page.label);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-1.5 text-left transition hover:bg-[#F7FAFC]">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={profileImage || fallbackImage}
            alt={adminName}
          />
          <p>{adminName}</p>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-auto rounded-lg bg-white dark:bg-slate-900 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Admin Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="mt-4 text-sm text-gray-500">Loading details...</p>
        ) : isError ? (
          <p className="mt-4 text-sm text-gray-500">Error fetching details</p>
        ) : !report ? (
          <p className="mt-4 text-sm text-gray-500">No details found</p>
        ) : (
          <div className="mt-4 space-y-4">
            <img
              src={report.profileImage || fallbackImage}
              alt={`${report.adminName} profile`}
              className="h-60 w-full rounded-xl object-cover"
            />

            <div className="space-y-3 rounded-xl border border-[#E6EDF5] bg-[#FAFCFF] p-4">
              <h3 className="text-2xl font-bold text-[#2D2D2D]">
                {report.adminName}
              </h3>

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-[#5B6474]">Email Address</span>
                <span className="font-medium text-[#2D2D2D]">
                  {report.email}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-[#5B6474]">Password</span>
                <span className="font-medium tracking-widest text-[#2D2D2D]">
                  **********
                </span>
              </div>

              {!!enabledAccessibility.length && (
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-[#5B6474]">Accessibility</span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {enabledAccessibility.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#D7E3F3] bg-white dark:bg-slate-900 px-3 py-1 text-[#2D2D2D]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!!enabledPages.length && (
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-[#5B6474]">Access to Pages</span>
                  <div className="space-y-1">
                    {enabledPages.map((page) => (
                      <p
                        key={page}
                        className="flex items-center justify-end gap-2 text-[#2D2D2D]"
                      >
                        <LayoutGrid className="h-4 w-4 text-[#5B6474]" />
                        {page}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleDelete(report.id)}
                  disabled={isDeleteLoading || !editable}
                  className="rounded-lg bg-red-500 px-4 disabled:cursor-not-allowed py-2 text-white hover:bg-red-600"
                >
                  {isDeleteLoading ? "Removing..." : "Remove Access"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminDetailsModal;
