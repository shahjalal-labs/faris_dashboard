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
import NoData from "@/components/Common/NoData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopBusinessQuery } from "@/redux/api/business.Api";
import Pagination from "@/components/Common/Pagination";
import { Download } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const TopRatedBusiness = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rated, setRated] = useState("true");
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);
  const {
    data: users,
    isLoading,
    isFetching,
  } = useTopBusinessQuery({ page, search: searchTerm, isTopRated: rated });

  const totalPage = users?.result?.meta?.totalPages;
  const businessRows = users?.result?.business || [];

  const handleExport = () => {
    if (businessRows.length === 0) {
      toast.error("No business data available to export");
      return;
    }

    const exportData = businessRows.map((user: any) => ({
      "Business Name": user?.fullName || "---",
      Region: user?.providerProfiles?.[0]?.region || "---",
      City: user?.providerProfiles?.[0]?.city || "---",
      Category: user?.providerProfiles?.[0]?.serviceCategory || "---",
      "Contact Info": user?.phoneNumber || "---",
      Rating: user?.avgRating || "---",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Rated Businesses");
    XLSX.writeFile(
      workbook,
      `top-rated-business-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <div className="p-5 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[6px]">
      <div className="lg:flex justify-between mb-4 items-center">
        <h1 className="font-medium">Top Rated Business</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by name or email.."
            type="text"
          />
          <button
            disabled={!editable}
            type="button"
            onClick={handleExport}
            className="border flex disabled:cursor-not-allowed items-center justify-center gap-1 px-4 text-white bg-bprimary rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Export <Download size={15} />
          </button>
          <select
            className="border rounded-[7px] bg-bprimary text-white px-4"
            name=""
            id=""
            onChange={(e) => setRated(e.target.value)}
          >
            <option value="true">Top Rated</option>
            <option value="false">Low Rated</option>
          </select>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Business Name
            </TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.business?.length > 0 ? (
            users.result.business.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex cursor-pointer items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.profileImage ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.fullName}
                        />
                        <AvatarFallback>{user?.fullName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {user?.fullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.providerProfiles?.[0]?.region || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.providerProfiles?.[0]?.city || "---"}
                  </TableCell>
                  <TableCell>
                    {user?.providerProfiles?.[0]?.serviceCategory || "---"}
                  </TableCell>
                  <TableCell>{user?.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <FaStar className="text-[#FAAD14]" /> {user?.avgRating}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Business"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.business?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default TopRatedBusiness;
