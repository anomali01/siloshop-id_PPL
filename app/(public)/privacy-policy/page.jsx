"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const data = [
  {
    title: "PENGANTAR",
    content:
      "Selamat datang di Siloshop.id, platform e-commerce yang bertujuan mempermudah mahasiswa UISI dalam menjual serta membeli makanan dan minuman di lingkungan kampus. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda selama menggunakan layanan kami.",
  },
  {
    title: "RINGKASAN",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-zinc-600 text-lg font-medium">
        <li>
          Kami mengumpulkan data seperti nama, kontak, lokasi pengantaran, dan
          data transaksi.
        </li>
        <li>
          Data digunakan untuk memproses pesanan dan meningkatkan layanan.
        </li>
        <li>
          Kami menjaga keamanan informasi Anda melalui sistem perlindungan data.
        </li>
        <li>
          Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data
          pribadi.
        </li>
        <li>Jika ada pertanyaan, Anda dapat menghubungi tim Siloshop.id.</li>
      </ul>
    ),
  },
  {
    title: "DATA PRIBADI YANG KAMI KUMPULKAN",
    content: (
      <div className="space-y-6 text-zinc-600 text-lg font-medium">
        <p className="text-2xl font-semibold">
          Jenis-Jenis Data Pribadi Yang Kami Kumpulkan Tentang Anda
        </p>

        <p>
          <span className="font-semibold">“Data Pribadi”</span> adalah data yang
          dapat mengidentifikasi atau digunakan untuk mengidentifikasi seseorang
          atau perangkat terkait. Data ini meliputi informasi seperti nama,
          alamat, nomor telepon, email, data transaksi, serta data teknis
          terkait penggunaan layanan. Data Pribadi mencakup semua informasi yang
          dikategorikan sebagai data pribadi menurut hukum dan peraturan
          perundang-undangan yang berlaku.
        </p>

        <p>
          Jenis Data Pribadi yang kami kumpulkan dapat berbeda tergantung
          layanan yang digunakan atau transaksi yang dilakukan pada Siloshop.id.
        </p>

        <p>
          Kami dapat membuat data statistik atau demografis untuk keperluan
          analisis. Data Gabungan berasal dari Data Pribadi Anda, tetapi{" "}
          <span className="font-semibold">
            tidak dianggap sebagai Data Pribadi
          </span>{" "}
          karena:
        </p>

        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Semua pengenal telah dihapus sehingga tidak dapat mengidentifikasi
            Anda
          </li>
          <li>Data digabungkan dengan data lain dalam jumlah besar</li>
        </ol>
      </div>
    ),
  },
  {
    title: "PENGGUNAAN DATA PRIBADI",
    content: (
      <div className="space-y-6 text-zinc-600 text-lg font-medium">
        <p>
          Kami dapat menggunakan Data Pribadi yang dikumpulkan untuk salah satu
          dari tujuan berikut ini:
        </p>

        <ol className="list-decimal pl-6 space-y-6">
          <li>
            <p className="font-semibold">Untuk Operasional Pesanan</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Mengonfirmasi pesanan</li>
              <li>Menghubungi pengguna</li>
              <li>Mengatur pengantaran</li>
            </ul>
          </li>

          <li>
            <p className="font-semibold">Untuk Pengembangan Layanan</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Menganalisis penggunaan platform</li>
              <li>Meningkatkan tampilan dan pengalaman pengguna</li>
            </ul>
          </li>

          <li>
            <p className="font-semibold">Untuk Keamanan</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Mencegah aktivitas mencurigakan</li>
              <li>Menjaga akun pengguna tetap aman</li>
            </ul>
          </li>
        </ol>

        <p className="font-semibold">
          Kami tidak menjual data pribadi Anda kepada pihak mana pun.
        </p>
      </div>
    ),
  },
  {
    title: "MELINDUNGI DATA PRIBADI ANDA",
    content:
      "Kerahasiaan Data Pribadi Anda adalah hal yang terpenting bagi Kami. Kami akan melakukan segala upaya yang wajar untuk melindungi dan mengamankan Data Pribadi Anda dari akses, pengumpulan, penggunaan atau pengungkapan oleh orang-orang yang tidak berwenang dan dari pemrosesan yang melanggar hukum, kehilangan yang tidak disengaja, pemusnahan dan kerusakan, atau risiko serupa. Namun, pengiriman data melalui internet tidak sepenuhnya aman. Meskipun Kami selalu melakukan yang terbaik untuk melindungi Data Pribadi Anda, Anda mengakui bahwa Kami tidak dapat menjamin integritas dan keakuratan Data Pribadi apa pun yang Anda kirimkan melalui Internet, atau menjamin bahwa Data Pribadi tersebut tidak akan dicegat, diakses, diungkapkan, diubah atau dimusnahkan oleh pihak ketiga yang tidak berwenang, karena faktor-faktor di luar kendali Kami. Anda bertanggung jawab untuk menjaga kerahasiaan rincian akun Anda dan Anda wajib untuk tidak membagikan rincian akun Anda, termasuk kata sandi Anda dan One Time Password (OTP) Anda, kepada siapa pun dan Anda juga harus selalu menjaga dan bertanggung jawab atas keamanan perangkat yang Anda gunakan.",
  },
  {
    title: "HAK ANDA SEBAGAI PENGGUNA",
    content: (
      <div className="space-y-6 text-zinc-600 text-lg font-medium">
        <p>
          Anda mungkin memiliki hak tertentu berdasarkan Peraturan
          Perundang-undangan yang Berlaku untuk meminta kepada Kami terhadap
          akses kepada, koreksi dari, dan/atau penghapusan terhadap Data Pribadi
          Anda yang berada dalam penguasaan dan kendali Kami. Sejauh hak-hak ini
          tersedia untuk Anda berdasarkan Peraturan Perundang-undangan yang
          Berlaku, Anda dapat menggunakan hak-hak ini dengan menghubungi kami
          melalui rincian yang disediakan di bagian di bawah ini.
        </p>

        <p>
          Kami berhak untuk menolak permintaan Anda terhadap akses, koreksi,
          dan/atau penghapusan sebagian atau seluruh Data Pribadi Anda yang Kami
          kuasai atau kendalikan apabila hal tersebut diperbolehkan atau
          diwajibkan berdasarkan Peraturan Perundang-undangan yang Berlaku. Hal
          ini termasuk dalam keadaan di mana Data Pribadi tersebut dapat memuat
          referensi kepada pihak lain, atau apabila permintaan akses, koreksi,
          atau penghapusan dilakukan untuk alasan yang Kami anggap tidak
          relevan, sembrono, atau sulit.
        </p>

        <p>
          Sesuai dengan Peraturan Perundang-undangan yang Berlaku, Kami berhak
          untuk membebankan biaya administrasi atas setiap permintaan akses
          dan/atau koreksi.
        </p>
      </div>
    ),
  },
  {
    title: "CATATAN TAMBAHAN",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-zinc-600 text-lg font-medium">
        <li>Kebijakan ini dapat diperbarui sewaktu-waktu.</li>
        <li>
          Jika ada perubahan penting, kami akan mengumumkannya melalui website.
        </li>
        <li>
          Penggunaan layanan secara berkelanjutan berarti Anda menyetujui
          perubahan tersebut.
        </li>
      </ul>
    ),
  },
  {
    title: "HUBUNGI KAMI",
    content:
      "Pengguna dapat menyampaikan pertanyaan, komentar, atau keperluan lainnya sehubungan dengan Pemberitahuan Privasi ini, termasuk mengajukan permohonan penarikan kembali persetujuan, akses, koreksi, atau penghapusan terhadap data pribadinya dengan cara menghubungi SILOSHOP.ID melalui telepon di 081390985657, email alfin.grs07@gmail.com.",
  },
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-5xl font-bold text-zinc-700 my-14">
          Privacy Policy
        </h1>

        {/* ACCORDION */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="border-4 border-red-600 rounded-xl overflow-hidden"
            >
              {/* HEADER */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-8 py-8 bg-white"
              >
                <h2 className="text-3xl font-semibold text-zinc-600 text-left">
                  {item.title}
                </h2>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={36}
                />
              </button>

              {/* GARIS MERAH */}
              <div className="mx-8 h-0.5 outline outline-[2px] outline-offset-[-1.50px] outline-red-600" />

              {/* CONTENT */}
              <div
                className={`px-8 text-zinc-600 text-lg font-medium transition-all duration-300 ${
                  openIndex === index ? "max-h-[2000px] py-6" : "max-h-0"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
