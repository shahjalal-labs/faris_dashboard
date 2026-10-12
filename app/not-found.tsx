import React from "react";
import Image from "next/image";
import Link from "next/link";
import notFoundImg from "@/assets/not-found.png";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-md w-full">
        <Image
          src={notFoundImg}
          alt="Page not found"
          width={500}
          height={500}
          priority
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-bprimary mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/">
          <Button className="bg-bprimary hover:bg-bprimary/80 text-white font-medium transition-all duration-500 ease-in-out cursor-pointer px-6 py-2">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
