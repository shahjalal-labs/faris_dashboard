"use client";
import { useState } from "react";
import SendOtp from "./components/SendOtp";
import VerifyOtp from "./components/VerifyOtp";
import NewPassword from "./components/NewPassword";

const page = () => {
  const [active, setActive] = useState("sendOtp");
  return (
    <div>
      {active === "sendOtp" && <SendOtp  setActive={setActive}/>}
      {active === "verifyOtp" && <VerifyOtp setActive={setActive} />}
      {active === "newPassword" && <NewPassword />}
    </div>
  );
};

export default page;
