"use client";
import Title from "./Title";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const BestSelling = () => {
  const displayQuantity = 8;
  const products = useSelector((state) => state.product.list);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <Title
        title={
          <div className="flex items-center gap-2">
            <span>Produk Terlaris</span>

            {/* ICON BINTANG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.716 1.48 8.228L12 18.896l-7.416 4.354 1.48-8.228L0 9.306l8.332-1.151z" />
            </svg>
          </div>
        }
        description={`Menampilkan ${
          products.length < displayQuantity ? products.length : displayQuantity
        } dari ${products.length} produk`}
        href="/shop"
      />
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-12">
        {products
          .slice()
          .sort((a, b) => b.rating.length - a.rating.length)
          .slice(0, displayQuantity)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSelling;
