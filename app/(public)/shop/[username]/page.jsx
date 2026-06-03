"use client";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

export default function StoreShop() {
  const { username } = useParams();
  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const { data } = await axios.get(`/api/store/data?username=${username}`);
      setStoreInfo(data.store);
      setProducts(data.store.Product);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  return !loading ? (
    <div className="min-h-[70vh] mx-6">
      {/* Store Info Banner */}
      {storeInfo && (
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-red-500 via-red-500 to-red-400 rounded-[20px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25) rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
            width={200}
            height={200}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-white">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-white mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="text-xs text-white mt-4 space-y-1"></div>
            <div className="space-y-2 text-sm text-white">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-white mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center">
                <MailIcon className="w-4 h-4 text-white  mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto mb-40">
        <h1 className="text-2xl mt-12">
          Shop <span className="text-slate-800 font-medium">Products</span>
        </h1>

        <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
          {products
            .filter((product) => product.inStock === true)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
