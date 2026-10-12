"use client";


import Overview from "@/components/overview/Overview";
import { JWTDecodeToken } from "@/lib/jwtDecode";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { decoded }: any = JWTDecodeToken();
  const router = useRouter();
  useEffect(() => {
    if (!decoded?.role || decoded?.role !== "Admin") {
      router.replace("/login");
    }
  }, [decoded, router]);
  return (
    <div>
      <Overview></Overview>
    </div>
  );
}
