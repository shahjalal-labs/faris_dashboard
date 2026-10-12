"use client";

import {

  useGetNotifyOptionsQuery,
  useUpdateNotifyOptionsMutation,
} from "@/redux/api/content.api";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type NotifyOptionKey =
  | "clientRegistered"
  | "businessRegistered"
  | "newAdvertisement"
  | "newFeedback"
  | "newBooking"
  | "bookingCancelled"
  | "offerExpirty";

const notifyOptions: Array<{ key: NotifyOptionKey; label: string }> = [
  { key: "clientRegistered", label: "New Client Registered" },
  { key: "businessRegistered", label: "New Business Registered" },
  { key: "newAdvertisement", label: "New Advertisement" },
  { key: "newFeedback", label: "New Feedback" },
  { key: "newBooking", label: "New Booking" },
  { key: "bookingCancelled", label: "Booking Cancelled" },
  { key: "offerExpirty", label: "Paid Advertisement Expiry or Near-Expiry Alert" },
];

const normalizeNotifyOptionValue = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
  return false;
};

const toSnakeCase = (value: string) =>
  value
    .replace(/offerExpirty/i, "offerExpiry")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase();

const getNotifyOptionValue = (
  result: Record<string, unknown> | undefined,
  key: NotifyOptionKey,
) => {
  if (!result) return false;

  const candidateKeys = [key, key.toLowerCase(), toSnakeCase(key)];

  for (const candidateKey of candidateKeys) {
    if (candidateKey in result) {
      return normalizeNotifyOptionValue(result[candidateKey]);
    }
  }

  const nestedResult =
    (result.result as Record<string, unknown> | undefined) ||
    (result.data as Record<string, unknown> | undefined) ||
    (result.notifyOptions as Record<string, unknown> | undefined) ||
    (result.options as Record<string, unknown> | undefined);

  if (nestedResult) {
    for (const candidateKey of candidateKeys) {
      if (candidateKey in nestedResult) {
        return normalizeNotifyOptionValue(nestedResult[candidateKey]);
      }
    }
  }

  return false;
};

const NotifyOption = () => {
  const { data, isFetching } =  useGetNotifyOptionsQuery("")

  const [updateNotify, { isLoading }] = useUpdateNotifyOptionsMutation();
  const [options, setOptions] = useState<Record<NotifyOptionKey, boolean>>({
    clientRegistered: false,
    businessRegistered: false,
    newAdvertisement: false,
    newFeedback: false,
    newBooking: false,
    bookingCancelled: false,
    offerExpirty: false,
  });

  useEffect(() => {
    if (!data?.result) {
      return;
    }

    setOptions({
      clientRegistered: getNotifyOptionValue(data.result, "clientRegistered"),
      businessRegistered: getNotifyOptionValue(data.result, "businessRegistered"),
      newAdvertisement: getNotifyOptionValue(data.result, "newAdvertisement"),
      newFeedback: getNotifyOptionValue(data.result, "newFeedback"),
      newBooking: getNotifyOptionValue(data.result, "newBooking"),
      bookingCancelled: getNotifyOptionValue(data.result, "bookingCancelled"),
      offerExpirty: getNotifyOptionValue(data.result, "offerExpirty"),
    });
  }, [data?.result]);

  const updateNotificationOption = async (
    key: NotifyOptionKey,
    value: boolean,
  ) => {
    const nextOptions = {
      ...options,
      [key]: value,
    };

    setOptions(nextOptions);

    try {
      const payload = {
        ...data?.result,
        ...nextOptions,
      };

      const res = await updateNotify(payload).unwrap();

      if (res?.success === false) {
        throw new Error(
          res?.message || "Failed to update notification options",
        );
      }

      toast.success(res?.message || "Notification options updated");
    } catch (error) {
      setOptions((current) => ({
        ...current,
        [key]: !value,
      }));

      toast.error(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update notification options",
      );
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6">
      <div className="mb-6 border-b border-[#E6EDF5] dark:border-slate-800 pb-3">
        <h2 className="text-lg font-medium text-[#2D2D2D] dark:text-slate-100">
          Notification Options
        </h2>
        <p className="mt-1 text-sm text-[#636F85] dark:text-slate-400">
          Enable or disable each notification type.
        </p>
      </div>

      <div className="space-y-4">
        {notifyOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#E6EDF5] dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-950 px-4 py-4"
          >
            <div>
              <p className="font-medium text-[#2D2D2D] dark:text-slate-100">
                {option.label}
              </p>
            </div>

            <Switch
              checked={options[option.key]}
              disabled={isFetching || isLoading}
              onCheckedChange={(checked) =>
                updateNotificationOption(option.key, checked)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotifyOption;
