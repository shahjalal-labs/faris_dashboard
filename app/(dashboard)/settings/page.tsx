"use client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import UpdateProfile from "./components/UpdateProfile";
import ChangePassword from "./components/ChangePassword";
import Accessibility from "./components/Accessibility";
import CancelReasons from "./components/CancelReasons";
import Feedbacks from "./components/Feedbacks";
import Support from "./components/Support";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PrivacyOffers from "./components/PrivacyOffers";
import BlockedUsers from "./components/BlockedUsers";
import NotifyOption from "./components/NotifyOption";
import CurrentFormula from "./components/CurrentFormula";

const Settings = () => {
  const [active, setActive] = useState("basic");
  return (
    <div className="text-slate-900 dark:text-slate-100">
      <div className="grid gap-8 grid-cols-3 items-start">
        <div className="col-span-3 lg:col-span-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-xl">
          <button
            onClick={() => setActive("basic")}
            className={`${
              active == "basic"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Basic <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("policy")}
            className={`${
              active == "policy"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Privacy Policy <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("offers")}
            className={`${
              active == "offers"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Privacy Offers <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("support")}
            className={`${
              active == "support"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Support <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("notifications")}
            className={`${
              active == "notifications"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Notification <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("password")}
            className={`${
              active == "password"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Change Password <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("accessibility")}
            className={`${
              active == "accessibility"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Accessibility <ChevronRight></ChevronRight>
          </button>
          {/* <button
            onClick={() => setActive("filter")}
            className={`${
              active == "filter"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Filter Settings <ChevronRight></ChevronRight>
          </button> */}
          <button
            onClick={() => setActive("cancellation")}
            className={`${
              active == "cancellation"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Cancellation Reason <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("feedback")}
            className={`${
              active == "feedback"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Feedback <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive("activation")}
            className={`${
              active == "activation"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Activation Formula <ChevronRight></ChevronRight>
          </button>
          {/* <button
            onClick={() => setActive("time")}
            className={`${
              active == "time"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Time & Date Settings <ChevronRight></ChevronRight>
          </button> */}
          <button
            onClick={() => setActive("block")}
            className={`${
              active == "block"
                ? "bg-bprimary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px] transition-colors`}
          >
            Block User <ChevronRight></ChevronRight>
          </button>
        </div>
        <div className="col-span-3 lg:col-span-2">
          {active == "basic" && <UpdateProfile></UpdateProfile>}
          {active == "password" && <ChangePassword></ChangePassword>}
          {active == "accessibility" && <Accessibility></Accessibility>}
          {active == "cancellation" && <CancelReasons></CancelReasons>}
          {active == "feedback" && <Feedbacks></Feedbacks>}
          {active == "support" && <Support></Support>}
          {active == "policy" && <PrivacyPolicy></PrivacyPolicy>}
          {active == "offers" && <PrivacyOffers></PrivacyOffers>}
          {active == "notifications" && <NotifyOption></NotifyOption>}
          {active == "block" && <BlockedUsers></BlockedUsers>}
          {active == "activation" && <CurrentFormula></CurrentFormula>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
