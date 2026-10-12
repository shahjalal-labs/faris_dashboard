"use client";

import { User } from "lucide-react";
import { useState } from "react";
import { CiHardDrive } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";
import { BsFillChatDotsFill } from "react-icons/bs";
import { MdStarBorderPurple500 } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import BusinessProfile from "./BusinessProfile";
import BusinessVerify from "./BusinessVerify";
import BusinessServices from "./BusinessServices";
import Bookings from "./Bookings";
import Reviews from "./Reviews";
import CompletedClients from "./CompletedClients";
import BusinessChats from "./BusinessChats";
import { useBusinessProfileQuery } from "@/redux/api/business.Api";

const STATIC_ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjM0NDIwNjY5MDc5ZWFkYTYxNzc5NCIsImVtYWlsIjoiZmFrZUBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJwaG9uZU51bWJlciI6IjAxNzAwMDAwMDAwIiwiaWF0IjoxNzg2NTkxMDkyLCJleHAiOjE3OTQ3OTkwOTJ9.zTISlpCVEQxjw1k3XZgIGbW1aDDKKtDRgGXirTsJhcM";
const STATIC_ADMIN_ID = "69f34420669079eada617794";

const BusinessDetails = ({ id }: any) => {
  const [active, setActive] = useState("profile");
  const { data: business, isLoading, isError } = useBusinessProfileQuery(id);
  return (
    <div>
      <BusinessVerify id={id} role="Business"></BusinessVerify>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <div
          onClick={() => setActive("profile")}
          className={`flex justify-between ${active === "profile" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Profile
          </h1>
          <div className="bg-[#0D834A]/10 rounded-[7px] text-[#0D834A] p-2">
            <User size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("service")}
          className={`flex justify-between ${active === "service" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Services
          </h1>
          <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
            <CiHardDrive size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("booking")}
          className={`flex justify-between ${active === "booking" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Bookings
          </h1>
          <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
            <RiDiscountPercentLine size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("chat")}
          className={`flex justify-between ${active === "chat" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Chat
          </h1>
          <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
            <BsFillChatDotsFill size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("reviews")}
          className={`flex justify-between ${active === "reviews" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Reviews
          </h1>
          <div className="bg-[#35C2CF]/10 rounded-[7px] text-[#35C2CF] p-2">
            <MdStarBorderPurple500 size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("wallet")}
          className={`flex justify-between ${active === "wallet" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center p-4 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Wallet
          </h1>
          <div className="bg-[#35C2CF]/10 rounded-[7px] text-[#35C2CF] p-2">
            <FaWallet size={17} />
          </div>
        </div>
      </div>
      <div>{active === "profile" && <BusinessProfile id={id} />}</div>
      <div>{active === "service" && <BusinessServices id={id} />}</div>
      <div>{active === "booking" && <Bookings id={id} />}</div>
      <div>{active === "reviews" && <Reviews id={id} />}</div>
      <div>{active === "wallet" && <CompletedClients id={id} />}</div>
      <div>
        {active === "chat" && (
          <BusinessChats
            token={business?.result?.accessToken}
            id={business?.result?.id}
            profileImage={business?.result?.profileImage}
            fullName={
              business?.result?.fullName || business?.result?.businessName
            }
            enableAdminMessaging
            businessId={business?.result?.id || id}
            adminToken={STATIC_ADMIN_TOKEN}
            adminId={STATIC_ADMIN_ID}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;
