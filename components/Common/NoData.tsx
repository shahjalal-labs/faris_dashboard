import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Loader } from "lucide-react";
import { LuInbox } from "react-icons/lu";

const NoData = ({
  title,
  isLoading,
  isFetching,
}: {
  title: string;
  isLoading: boolean;
  isFetching: boolean;
}) => {
  return (
    <TableRow>
      <TableCell
        colSpan={9}
        className="text-center py-4 text-gray-500 dark:text-slate-400"
      >
        {isLoading || isFetching ? (
          <div>
            <Loader size={30} className="animate-spin mx-auto  text-primary" />
            <h1 className="mt-2">Loading {title}</h1>
          </div>
        ) : (
          <div className="flex items-center flex-col">
            <LuInbox
              size={50}
              className="text-gray-300 dark:text-slate-600 pb-3"
            ></LuInbox>
            <h1>No {title} Found</h1>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default NoData;
