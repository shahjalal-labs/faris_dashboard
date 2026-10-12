"use client";

import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useBusinessWalletQuery } from "@/redux/api/business.Api";
import { CalendarIcon, SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CompletedClientsOverviewChart from "./CompletedClientsOverviewChart";

type WalletClient = {
  id?: string;
  date?: string;
  time?: string;
  price?: number | string;
  user?: {
    id?: string;
    fullName?: string;
    profileImage?: string;
  };
  service?: {
    serviceName?: string;
  };
  offer?: {
    serviceName?: string;
  };
};

function parseClientDate(date?: string): Date | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseClientPrice(price?: number | string): number {
  const value = Number(price ?? 0);
  return Number.isNaN(value) ? 0 : value;
}

const EmptyMessage = ({ text }: { text: string }) => (
  <p className="text-gray-500 dark:text-slate-400">{text}</p>
);

const ClientCard = ({ item, index }: { item: WalletClient; index: number }) => {
  const parsedDate = parseClientDate(item?.date);

  return (
    <div
      key={item?.id || `${item?.user?.id || "user"}-${index}`}
      className="flex justify-between border p-3 rounded-2xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 items-center"
    >
      <div className="flex items-center gap-2">
        <Image
          className="w-16 object-cover rounded-full h-16"
          src={
            item?.user?.profileImage ||
            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
          }
          alt={item?.user?.fullName || "Client"}
          width={50}
          height={50}
        />
        <div>
          <h1 className="text-slate-900 dark:text-slate-100">
            {item?.service?.serviceName ||
              item?.offer?.serviceName ||
              "Service"}
          </h1>
          <h1 className="text-xs text-gray-500 dark:text-slate-400">
            {item?.user?.fullName || "Unknown Client"}
          </h1>
          <div className="flex text-xs text-gray-500 dark:text-slate-400 gap-1">
            <p>
              {parsedDate
                ? parsedDate.toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                  })
                : "--"}
              ,
            </p>
            <p>{item?.time || "--"}</p>
          </div>
        </div>
      </div>
      <div className="flex text-slate-900 dark:text-slate-100">
        <SaudiRiyal />
        <p>{parseClientPrice(item?.price)}</p>
      </div>
    </div>
  );
};

const ClientGrid = ({ items }: { items: WalletClient[] }) => (
  <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item, index) => (
      <ClientCard
        key={item?.id || `${item?.user?.id || "user"}-${index}`}
        item={item}
        index={index}
      />
    ))}
  </ul>
);

const CompletedClients = ({ id }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data } = useBusinessWalletQuery(id);

  const clients: WalletClient[] = data?.result || [];

  const totalPrice = useMemo(
    () => clients.reduce((sum, item) => sum + parseClientPrice(item?.price), 0),
    [clients],
  );

  const selectedDateClients = useMemo(
    () =>
      clients.filter((item) => {
        const date = parseClientDate(item?.date);
        return date ? isSameDay(date, selectedDate) : false;
      }),
    [clients, selectedDate],
  );

  return (
    <div>
      <div className="flex flex-col items-center rounded-2xl bg-bprimary/10 dark:bg-bprimary/15 border border-bprimary/20 py-6 my-6">
        <h1 className="text-slate-900 dark:text-slate-100">Total Earning</h1>
        <div className="flex pt-3 items-center text-slate-900 dark:text-slate-100">
          <SaudiRiyal></SaudiRiyal>
          <p className="text-3xl font-medium">{totalPrice?.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white mb-6 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl font-semibold">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-slate-900 dark:text-slate-100">
            Completed Clients
          </h1>
          <button className="bg-bprimary text-white px-4 py-1 rounded-2xl">
            History
          </button>
        </div>
        {clients.length > 0 ? (
          <ClientGrid items={clients} />
        ) : (
          <EmptyMessage text="No completed clients found." />
        )}
      </div>

      <CompletedClientsOverviewChart clients={clients} />

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl font-semibold mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-slate-900 dark:text-slate-100">Today</h1>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "dd MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {selectedDateClients.length > 0 ? (
          <ClientGrid items={selectedDateClients} />
        ) : (
          <EmptyMessage text="No completed clients found for the selected date." />
        )}
      </div>
    </div>
  );
};

export default CompletedClients;
