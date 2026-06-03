"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";
const AdminNavbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-12 py-3 rounded-[10px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-all">
      <Link href="/" className="flex items-center">
        <Image
          src="/siloshop-logo-admin.png"
          alt="SILOSHOP.ID"
          width={140}
          height={40}
        />
                 
      </Link>
      <div className="flex items-center gap-3">
        <p>Hi, {user?.firstName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default AdminNavbar;
