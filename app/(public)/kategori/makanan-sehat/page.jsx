"use client";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const CATEGORY_NAME = "Makanan sehat";

function ShopContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const router = useRouter();

  const products = useSelector((state) => state.product.list);

  // FILTER kategori + search
  const filteredProducts = products
    .filter(
      (product) =>
        product.category?.toLowerCase() === CATEGORY_NAME.toLowerCase()
    )
    .filter((product) =>
      search ? product.name.toLowerCase().includes(search.toLowerCase()) : true
    );

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        <h1
          onClick={() => router.push("/shop")}
          className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
        >
          {search && <MoveLeftIcon size={20} />}
          All{" "}
          <span className="text-slate-700 font-medium">{CATEGORY_NAME}</span>
        </h1>

        {/*Kondisi jika kosong */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-60 text-slate-500 text-center gap-3 mt-12">
            <p className="text-2xl">Maaf belum ada produk dalam kategori</p>
            <span className="text-3xl font-semibold text-slate-700">
              {CATEGORY_NAME}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
