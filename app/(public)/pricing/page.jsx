"use client";

import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { user, isLoaded } = useUser();

  //Tunggu Clerk siap
  if (!isLoaded) {
    return <Loading />;
  }

  //Belum login
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 text-center max-w-md mx-auto">
          <ShieldCheck className="mx-auto text-red-500 w-16 h-16 mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Akses Terbatas</h1>
          <p className="text-slate-500 mb-6">
            Silakan login terlebih dahulu untuk melihat dan memilih paket membership SILOSHOP.ID.
          </p>
          <a
            href="/sign-in"
            className="inline-block w-full py-3 px-6 text-center text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-xl font-medium shadow-md shadow-red-500/20"
          >
            Login Sekarang
          </a>
        </div>
      </div>
    );
  }

  const handleSubscribe = (planName) => {
    toast.success(`Simulasi langganan ${planName} sukses! Di lingkungan local-dev, pembayaran terhubung ke Stripe disimulasikan.`);
  };

  const plans = [
    {
      name: "Silo Basic",
      price: "Rp 0",
      period: "selamanya",
      description: "Untuk belanja harian standar tanpa komitmen.",
      icon: Zap,
      iconColor: "text-slate-400 bg-slate-100",
      features: [
        "Akses belanja semua produk",
        "Pendaftaran hingga 5 alamat",
        "Metode pembayaran COD & Standard",
        "Standard Support"
      ],
      buttonText: "Paket Aktif",
      buttonClass: "bg-slate-100 text-slate-600 cursor-not-allowed",
      popular: false
    },
    {
      name: "Silo Plus",
      price: "Rp 49.000",
      period: "bulan",
      description: "Pilihan paling populer untuk pembelanja setia.",
      icon: Sparkles,
      iconColor: "text-red-500 bg-red-50",
      features: [
        "Semua fitur paket Basic",
        "Gratis Ongkos Kirim (Bypass biaya Rp 5.000)",
        "Akses kupon eksklusif member (MEMBER20)",
        "Lencana khusus di profil pembeli",
        "Priority Support 24/7"
      ],
      buttonText: "Berlangganan Sekarang",
      buttonClass: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5",
      popular: true
    },
    {
      name: "Silo Premium",
      price: "Rp 99.000",
      period: "bulan",
      description: "Akses tanpa batas dengan benefit paling maksimal.",
      icon: ShieldCheck,
      iconColor: "text-purple-500 bg-purple-50",
      features: [
        "Semua fitur paket Plus",
        "Cashback koin 5% untuk setiap transaksi",
        "Akses awal untuk produk pre-order & diskon flash",
        "Bebas biaya admin penarikan saldo",
        "Dedicated Account Manager"
      ],
      buttonText: "Mulai Premium",
      buttonClass: "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full uppercase tracking-wider">
            Membership Plan
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mt-4 tracking-tight">
            Pilih Paket Terbaik <span className="text-red-500">Belanja Anda</span>
          </h1>
          <p className="text-lg text-slate-500 mt-4 leading-relaxed">
            Dapatkan ongkos kirim gratis, akses kupon eksklusif, dan penawaran terbaik untuk memaksimalkan pengalaman belanja di SILOSHOP.ID.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`relative flex flex-col justify-between p-8 bg-white rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-red-500 shadow-xl md:scale-105 z-10"
                    : "border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Paling Populer
                  </span>
                )}

                <div>
                  {/* Icon & Plan Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-2xl ${plan.iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                      <p className="text-xs text-slate-400">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-800">{plan.price}</span>
                    <span className="text-slate-400 text-sm ml-2">/ {plan.period}</span>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => !plan.buttonClass.includes("cursor-not-allowed") && handleSubscribe(plan.name)}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-200 active:scale-95 ${plan.buttonClass}`}
                  disabled={plan.buttonClass.includes("cursor-not-allowed")}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-xs text-slate-400">
          <p>
            * Clerk Billing System di lingkungan Development disimulasikan. 
            Untuk integrasi produksi sesungguhnya, silakan hubungkan Stripe melalui Dashboard Clerk.
          </p>
        </div>
      </div>
    </div>
  );
}

