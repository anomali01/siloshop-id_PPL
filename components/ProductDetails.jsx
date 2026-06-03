"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  const averageRating =
    product.rating.reduce((acc, item) => acc + item.rating, 0) /
    product.rating.length;

  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className="bg-gradient-to-br from-red-500 via-red-500 to-red-400 flex items-center justify-center size-26 rounded-lg cursor-pointer"
            >
              <div className="bg-slate-200 rounded-md">
                <Image
                  src={image}
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-md transition group-hover:scale-103 group-active:scale-95"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="w-96 h-96 bg-gradient-to-br from-red-500 via-red-500 to-red-400 rounded-[10px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.10)] flex justify-center items-center">
          <div className="bg-slate-200 rounded-[10px]">
            <Image
              src={mainImage}
              alt=""
              width={264}
              height={264}
              className="rounded-[10px]"
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">
          {product.name}
        </h1>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={averageRating >= index + 1 ? "#FFCC00" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            {product.rating.length} Reviews
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>
            {" "}
            {currency}
            {product.price}{" "}
          </p>
          <p className="text-xl text-slate-500 line-through">
            {currency}
            {product.mrp}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>
            Save{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
            right now
          </p>
        </div>
        <div className="flex items-end gap-5 mt-10">
          {cart[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">Jumlah</p>
              <Counter productId={productId} />
            </div>
          )}
          <button
            onClick={() =>
              !cart[productId] ? addToCartHandler() : router.push("/cart")
            }
            className="bg-red-500 text-white px-10 py-3 text-sm font-medium rounded hover:bg-red-700 active:scale-95 transition"
          >
            {!cart[productId] ? "Tambah ke Keranjang" : "Lihat Keranjang"}
          </button>
        </div>
        <hr className="border-gray-300 my-5" />
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            {" "}
            <EarthIcon className="text-slate-400" /> Gratis Ongkir{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <CreditCardIcon className="text-slate-400" /> 100% Pembayaran Aman{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <UserIcon className="text-slate-400" /> Terbukti Terpercaya{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
