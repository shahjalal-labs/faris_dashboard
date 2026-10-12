"use client";
import BusinessVerify from "../../business-management/components/BusinessVerify";
import { CiHardDrive } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";
import { BsFillChatDotsFill } from "react-icons/bs";
import { MdStarBorderPurple500 } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { User } from "lucide-react";
import { useState } from "react";
import UserProfile from "./UserProfile";
import UserBookings from "./UserBookings";
import BusinessChats from "../../business-management/components/BusinessChats";
import { useUserDetailsQuery } from "@/redux/api/authApi";
import GivenReviews from "./GivenReviews";

const UserDetailsModal = ({ id }: any) => {
  const [active, setActive] = useState("profile");
  const { data: business, isLoading, isError } = useUserDetailsQuery(id);

  return (
    <div>
      <BusinessVerify id={id} role="Client"></BusinessVerify>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          onClick={() => setActive("profile")}
          className={`flex justify-between ${active === "profile" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center px-4 py-6 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Profile
          </h1>
          <div className="bg-[#0D834A]/10 rounded-[7px] text-[#0D834A] p-2">
            <User size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("booking")}
          className={`flex justify-between ${active === "booking" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center px-4 py-6 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Bookings
          </h1>
          <div className="bg-[#FF9200]/10 rounded-[7px] text-[#FF9200] p-2">
            <CiHardDrive size={17} />
          </div>
        </div>
        <div
          onClick={() => setActive("chat")}
          className={`flex justify-between ${active === "chat" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center px-4 py-6 rounded-2xl cursor-pointer transition-colors`}
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
          className={`flex justify-between ${active === "reviews" ? "bg-[#1CAF8F1A] dark:bg-bprimary/20 border-bprimary/30" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"} border items-center px-4 py-6 rounded-2xl cursor-pointer transition-colors`}
        >
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            Reviews
          </h1>
          <div className="bg-[#35C2CF]/10 rounded-[7px] text-[#35C2CF] p-2">
            <MdStarBorderPurple500 size={17} />
          </div>
        </div>
      </div>
      <div>{active === "profile" && <UserProfile id={id} />}</div>
      <div>{active === "booking" && <UserBookings id={id} />}</div>
      <div>{active === "reviews" && <GivenReviews id={id} />}</div>
      <div>
        {active === "chat" && (
          <BusinessChats
            token={business?.result?.accessToken}
            id={business?.result?.id}
            profileImage={business?.result?.profileImage}
            fullName={
              business?.result?.fullName || business?.result?.businessName
            }
          />
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
