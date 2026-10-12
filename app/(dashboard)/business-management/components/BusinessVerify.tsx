"use client";

import { toast } from "sonner";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  useBusinessProfileQuery,
  useVerifyBusinessMutation,
} from "@/redux/api/business.Api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNextStatusOptions = (currentStatus?: string) => {
  switch (currentStatus) {
    case "Pending":
      return ["Active", "Rejected"];
    case "Rejected":
      return ["Active"];
    case "Active":
      return ["Rejected"];
    default:
      return [];
  }
};

const getStatusStyles = (status?: string) => {
  switch (status) {
    case "Active":
      return "text-green-600 bg-green-50";
    case "Pending":
      return "text-yellow-600 bg-yellow-50";
    case "Rejected":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const BusinessVerify = ({ id, role }: any) => {
  const { data: business, isLoading, isError } = useBusinessProfileQuery(id);
  const [verifyBusiness, { isLoading: isUpdating }] =
    useVerifyBusinessMutation();
   

  const currentStatus = business?.result?.status;
  const nextStatusOptions = getNextStatusOptions(currentStatus);

  const handleVerify = async (status: string) => {
    try {
      const payload = {
        id,
        status,
      };

      const res = await verifyBusiness(payload).unwrap();

      if (res?.success) {
        toast.success(`Business status updated to ${status}`);
      } else {
        toast.error("Failed to update business status");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update business status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex pb-6 justify-between items-center">
        <h1 className="font-semibold text-xl">Business Details</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex pb-6 justify-between items-center">
        <h1 className="font-semibold text-xl">Business Details</h1>
      </div>
    );
  }

  return (
    <div className="flex pb-6 justify-between items-center">
      <h1 className="font-semibold md:text-xl">
        {role}- {business?.result?.fullName}
      </h1>

      {role == "Business" && (
        <>
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isUpdating || nextStatusOptions.length === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${getStatusStyles(
                currentStatus,
              )} ${isUpdating || nextStatusOptions.length === 0 ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{currentStatus || "Unknown"}</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </DropdownMenuTrigger>

            {nextStatusOptions.length > 0 && (
              <DropdownMenuContent align="end" className="w-[140px] p-2">
                {nextStatusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="rounded-md py-2 px-3 cursor-pointer"
                    onClick={() => handleVerify(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default BusinessVerify;
