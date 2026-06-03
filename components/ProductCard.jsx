"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rp";

  // calculate the average rating of the product
  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className="group max-xl:mx-auto bg-red-500 rounded-xl p-3 shadow-md"
    >
      <div className="h-40 sm:w-54 sm:h-60 bg-slate-200 rounded-lg flex items-center overflow-hidden">
        <Image
          width={500}
          height={500}
          className="h-full w-auto object-cover group-hover:scale-105 transition duration-300"
          src={product.images[0]}
          alt=""
        />
      </div>
      <div className="flex justify-between gap-3 text-sm text-white pt-2 max-w-60">
        <div>
          <p>{product.name}</p>
          <div className="flex">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <StarIcon
                  key={index}
                  size={14}
                  className="text-transparent mt-0.5"
                  fill={rating >= index + 1 ? "#FFCC00" : "#D1D5DB"}
                />
              ))}
          </div>
        </div>
        <p>
          {currency}
          {product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
