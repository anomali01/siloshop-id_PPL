"use client";

import { PricingTable, useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";

export default function PricingPage() {
  const { user, isLoaded } = useUser();

  //Tunggu Clerk siap
  if (!isLoaded) {
    return <Loading />;
  }

  //Belum login
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
          Silakan <span className="text-slate-600">login</span> untuk mengakses
          halaman ini
        </h1>
      </div>
    );
  }

  //Sudah login
  return (
    <div className="mx-auto max-w-[700px] my-28">
      <PricingTable />
    </div>
  );
}
