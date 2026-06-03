"use client";

import React from "react";
import Title from "./Title";
import { useUser, useClerk } from "@clerk/nextjs";

const Newsletter = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  // Hindari flicker saat user belum ter-load
  if (!isLoaded) return null;

  // Jika SUDAH login tidak tampilkan apa-apa
  if (user) return null;

  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <Title
        title="Mau Belanja? Login Dulu Yuk!"
        description="Login untuk menikmati semua fitur dan penawaran eksklusif dari SILOSHOP.ID"
        visibleButton={false}
      />

      <button
        onClick={openSignIn}
        className="mt-10 font-medium bg-red-500 text-white px-10 py-3 rounded-full hover:bg-red-600 active:scale-95 transition"
      >
        Login
      </button>
    </div>
  );
};

export default Newsletter;
