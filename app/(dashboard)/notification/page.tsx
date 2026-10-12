"use client";

import { useMemo } from "react";
import { Bell, Trash2 } from "lucide-react";
import {
  useDashboardNotifyQuery,
  useDeleteAllNotifyMutation,
  useDeleteNotifyMutation,
} from "@/redux/api/content.api";

const formatDate = (value?: string) => {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const NotificationPage = () => {
  const { data, isLoading, isFetching, refetch } = useDashboardNotifyQuery("");
  const [deleteNotify, { isLoading: isDeleting }] = useDeleteNotifyMutation();
  const [deleteAllNotify, { isLoading: isDeletingAll }] =
    useDeleteAllNotifyMutation();

  const handleDeleteNotify = async (id: string) => {
    try {
      // Use unwrap if available to throw on error
      // @ts-ignore
      if (deleteNotify.unwrap) await deleteNotify(id).unwrap();
      else await deleteNotify(id);
    } catch (err) {
      console.error("Failed to delete notification", err);
    } finally {
      refetch();
    }
  };

  const handleDeleteAllNotify = async () => {
    try {
      // Some APIs expect an empty string; keep existing behaviour
      // @ts-ignore
      if (deleteAllNotify.unwrap) await deleteAllNotify("").unwrap();
      else await deleteAllNotify("");
    } catch (err) {
      console.error("Failed to delete all notifications", err);
    } finally {
      refetch();
    }
  };

  const notifications = useMemo(() => {
    const items = Array.isArray(data?.result?.notify) ? data.result.notify : [];

    return [...items].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [data]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              Recent notifications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing the newest updates first.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAllNotify}
                disabled={isDeletingAll}
                className="rounded-md bg-red-50 cursor-pointer px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
              >
                Delete all
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {notifications.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                          {item?.title || "Notification"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatDate(item?.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteNotify(item.id)}
                        disabled={isDeleting}
                        className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {item?.content || "No description available."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <Bell className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                No notifications yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                New account activity will appear here as soon as it is
                available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotificationPage;
