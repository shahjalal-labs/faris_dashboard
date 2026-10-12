"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AllBusiness from "./components/AllBusiness";
import BusinessDetails from "./components/BusinessDetails";

const businessPage = () => {
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
        <AllBusiness setStatus={setStatus} setId={setId} />
      ) : (
        <BusinessDetails id={id}></BusinessDetails>
      )}
    </div>
  );
};

export default businessPage;
