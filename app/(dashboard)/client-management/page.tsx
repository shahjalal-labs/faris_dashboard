"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AllUsers from "./components/AllUsers";
import UserDetailsModal from "./components/UserDetailsModal";

const page = () => {
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [status, setStatus] = useState("business");
  const [id, setId] = useState("");

  useEffect(() => {
    // Reset to "business" view when view=all param is present (clicked from sidebar)
    if (searchParams.get("view") === "all") {
      setStatus("business");
      setId("");
    }
  }, [searchKey]);

  return (
    <div>
      {status === "business" ? (
        <AllUsers setStatus={setStatus} setId={setId} />
      ) : (
        <UserDetailsModal id={id}></UserDetailsModal>
      )}
    </div>
  );
};

export default page;
