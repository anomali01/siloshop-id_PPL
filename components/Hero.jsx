"use client";
import { assets } from "@/assets/assets";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesMarquee from "./CategoriesMarquee";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rp";
  const router = useRouter();

  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-red-500 via-red-500 to-red-400 rounded-3xl shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] xl:min-h-100 group">
          <div className="p-5 sm:p-16">
            <Link href="/shop">
              <div className="group inline-flex cursor-pointer items-center gap-3 bg-red-200 text-red-600 pr-4 p-1 rounded-full text-xs sm:text-sm hover:bg-red-300 transition">
                <span className="bg-red-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">
                  NEWS
                </span>
                Kini SHILOSHOP.ID hadir untuk memenuhi kebutuhan perut anda.
                <ChevronRightIcon
                  size={16}
                  className="cursor-pointer group-hover:ml-1 transition-all group-hover:text-red-800"
                />
              </div>
            </Link>
            <h2 className="text-2xl sm:text-4xl leading-[1.2] my-3 font-medium text-white bg-clip-text text-transparent max-w-xs  sm:max-w-md">
              Makanan yang Anda sukai. Harga yang terpercaya.
            </h2>
            <div className="text-white text-sm font-medium mt-4 sm:mt-8">
              <p>Mulai dari</p>
              <p className="text-3xl">{currency}10000</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="bg-white text-red-600 text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-gray-200 hover:scale-103 active:scale-95 transition"
            >
              Lihat lebih lanjut
            </button>
          </div>
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
            src={assets.hero_model_img}
            alt=""
          />
        </div>
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          <div className="flex-1 flex items-center justify-between w-full bg-gradient-to-br from-orange-400 via-orange-300 to-orange-300 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium text-white bg-clip-text text-transparent max-w-50">
                Buat Toko Anda Sendiri!
              </p>
              <p className="flex items-center gap-1 mt-4 text-white">
                <Link href="/create-store" className="flex items-center gap-1">
                  Lihat lebih lanjut{" "}
                  <ArrowRightIcon
                    className="group-hover:ml-2 transition-all"
                    size={18}
                  />{" "}
                </Link>
              </p>
            </div>
            <Image
              className="w-44 h-40"
              src={assets.hero_product_img1}
              alt=""
            />
          </div>
          <div className="flex-1 flex items-center justify-between w-full bg-gradient-to-br from-amber-300 via-amber-250 to-amber-200 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium text-white bg-clip-text text-transparent max-w-50">
                Ayo Jadi Member Plus!
              </p>
              <p className="flex items-center gap-1 mt-4 text-white">
                <Link href="/pricing" className="flex items-center gap-1">
                  Lihat lebih lanjut{" "}
                  <ArrowRightIcon
                    className="group-hover:ml-2 transition-all"
                    size={18}
                  />{" "}
                </Link>
              </p>
            </div>
            <Image
              className="w-44 h-40"
              src={assets.hero_product_img2}
              alt=""
            />
          </div>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
};

export default Hero;
