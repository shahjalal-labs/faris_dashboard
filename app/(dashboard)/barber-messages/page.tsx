import React from "react";
import AllNotifications from "./components/AllNotification";
import SendNotificationModal from "./components/SendNotificationModal";
import Welcome from "./components/Welcome";

const BarberMessages = () => {
  return (
    <div>
        <div className="flex">
            <Welcome role="Provider"></Welcome>
        </div>
      <div className="flex justify-between pb-6 items-center">
        <h1 className="font-medium md:text-2xl">Message History</h1>
        <SendNotificationModal></SendNotificationModal>
      </div>
      <AllNotifications></AllNotifications>
    </div>
  );
};

export default BarberMessages;
