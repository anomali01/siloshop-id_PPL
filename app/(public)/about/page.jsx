"use client";

import { Suspense } from "react";
import Image from "next/image";
import OurSpecs from "@/components/OurSpec";

function AboutContent() {
  return (
    <div className="min-h-[70vh] mx-6 mb-32">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <section className="bg-gradient-to-br from-red-500 to-red-400 rounded-3xl px-10 py-20 mt-10 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* TEXT */}
            <div>
              <h1 className="text-6xl font-extrabold mb-6">About Us</h1>
              <p className="text-xl font-semibold max-w-xl">
                Siloshop.id adalah platform pemesanan makanan dan minuman di
                lingkungan Universitas Internasional Semen Indonesia yang dibuat
                untuk memudahkan mahasiswa, dosen maupun staff dalam
                berwirausaha.
              </p>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/siloshop-logo.png"
                alt="SILOSHOP.ID"
                width={440}
                height={440}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* WHY SECTION */}
        <section className="grid md:grid-cols-2 gap-16 items-center mt-32">
          {/* IMAGE */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/siloshop-logo.png"
              alt="SILOSHOP.ID"
              width={440}
              height={440}
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Mengapa Kami Hadir?</h2>
            <ul className="text-zinc-600 font-semibold space-y-3">
              <li>
                • Memberikan ruang bagi mahasiswa, dosen dan staff untuk
                berwirausaha
              </li>
              <li>• Mempermudah jual–beli makanan dan minuman di kampus</li>
              <li>• Mengurangi transaksi manual</li>
              <li>
                • Membangun ekosistem bisnis kampus yangmodern dan efisien
              </li>
            </ul>
          </div>
        </section>

        {/* VALUE SECTION */}
        <OurSpecs />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading about...</div>}>
      <AboutContent />
    </Suspense>
  );
}
