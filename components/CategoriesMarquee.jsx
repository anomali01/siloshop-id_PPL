"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/assets/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriesFiveCenter() {
  const [items, setItems] = useState(categories.slice(0, 5));
  const router = useRouter();

  const moveRight = () => {
    setItems((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
  };

  const moveLeft = () => {
    setItems((prev) => {
      const first = prev[0];
      const rest = prev.slice(1);
      return [...rest, first];
    });
  };

  const centerItem = items[2];

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="relative w-full py-10 select-none hidden md:flex flex-col items-center gap-6">
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-slate-800">
          Kategori Produk
        </h2>

        <div className="relative w-full flex justify-center">
          {/* LEFT ARROW */}
          <button
            onClick={moveLeft}
            className="absolute inset-y-0 my-auto
      left-[calc(50%-595px-40px)]
      z-30 bg-red-500 text-white
      w-14 h-14 flex items-center justify-center
      rounded-full shadow-lg
      hover:scale-110 transition"
          >
            <ChevronLeft size={40} />
          </button>

          {/* CONTAINER */}
          <div className="relative w-[1190px] h-72 bg-gradient-to-br from-red-500 via-red-500 to-red-400 rounded-[50px] overflow-hidden">
            <div className="absolute left-[65px] top-[40px] inline-flex items-center gap-11">
              {items.map((item, index) => {
                const isCenter = index === 2;

                return (
                  <div
                    key={index}
                    onClick={
                      isCenter
                        ? () => router.push(`/kategori/${item.slug}`)
                        : undefined
                    }
                    className={`
        flex flex-col items-center justify-center text-center
        rounded-2xl shadow-[0px_5px_10px_rgba(0,0,0,0.25)]
        transition-all duration-300
        ${
          isCenter
            ? "cursor-pointer hover:scale-105 active:scale-95 bg-white w-48 h-52 scale-110 text-red-600 font-semibold"
            : "pointer-events-none bg-white/70 w-44 h-44 text-red-500 opacity-70"
        }
      `}
                  >
                    <div
                      className={`${
                        isCenter ? "w-24 h-24" : "w-20 h-20"
                      } mb-3 flex items-center justify-center`}
                    >
                      {item.icon}
                    </div>

                    <div
                      className={`${
                        isCenter ? "text-2xl" : "text-xl"
                      } font-semibold`}
                    >
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={moveRight}
            className="absolute inset-y-0 my-auto
      right-[calc(50%-595px-40px)]
      z-30 bg-red-500 text-white
      w-14 h-14 flex items-center justify-center
      rounded-full shadow-lg
      hover:scale-110 transition"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden flex flex-col items-center gap-4 py-8">
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-slate-800">
          Kategori Produk
        </h2>

        <div className="relative w-[90%] h-56 bg-gradient-to-br from-red-500 via-red-500 to-red-400 rounded-[32px] flex items-center justify-center">
          {/* LEFT */}
          <button
            onClick={moveLeft}
            className="absolute inset-y-0 my-auto left-3
      bg-white text-red-500 w-10 h-10 rounded-full shadow"
          >
            <ChevronLeft size={40} />
          </button>

          {/* CENTER ITEM */}
          <div
            onClick={() => router.push(`/kategori/${centerItem.slug}`)}
            className="cursor-pointer bg-white w-44 h-48 rounded-2xl
      shadow-lg flex flex-col items-center justify-center
      text-center text-red-600 font-semibold
      active:scale-95 transition"
          >
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              {centerItem.icon}
            </div>
            <div className="text-xl">{centerItem.title}</div>
          </div>

          {/* RIGHT */}
          <button
            onClick={moveRight}
            className="absolute inset-y-0 my-auto right-3
      bg-white text-red-500 w-10 h-10 rounded-full shadow"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>
    </>
  );
}
