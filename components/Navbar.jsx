"use client";
import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { LayoutDashboardIcon } from "lucide-react";
import { StoreIcon } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken, isLoaded } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };
  useEffect(() => {
    if (!isLoaded || !user) {
      setIsAdmin(false);
      setIsSeller(false);
      return;
    }

    const checkRoles = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const [adminRes, sellerRes] = await Promise.allSettled([
          axios.get("/api/admin/is-admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/store/is-seller", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIsAdmin(
          adminRes.status === "fulfilled" && adminRes.value.data.isAdmin
        );

        setIsSeller(
          sellerRes.status === "fulfilled" && sellerRes.value.data.isSeller
        );
      } catch {
        setIsAdmin(false);
        setIsSeller(false);
      }
    };

    checkRoles();
  }, [isLoaded, user?.id, getToken]);

  return (
    <nav className="relative bg-white rounded-[10px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)]">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
          {!open && (
            <Link href="/" className="flex items-center gap-2 relative">
              <Image
                src="/siloshop-logo.png"
                alt="SILOSHOP.ID"
                width={140}
                height={40}
              />

              <Protect plan="plus">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-red-500">
                  PLUS
                </span>
              </Protect>
            </Link>
          )}

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/" className="relative group">
              <span className="pb-1">Home</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/shop" className="relative group">
              <span className="pb-1">Shop</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/about" className="relative group">
              <span className="pb-1">About</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="#footer" className="relative group">
              <span className="pb-1">Contact</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Cari produk"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />

                  {isAdmin && (
                    <UserButton.Action
                      labelIcon={<LayoutDashboardIcon size={16} />}
                      label="Admin Dashboard"
                      onClick={() => router.push("/admin")}
                    />
                  )}

                  {isSeller && (
                    <UserButton.Action
                      labelIcon={<StoreIcon size={16} />}
                      label="My Store"
                      onClick={() => router.push("/store")}
                    />
                  )}
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          <div className="flex items-center gap-3 sm:hidden">
            {!open && (
              <>
                {/* SEARCH ICON */}
                <button onClick={() => setShowSearch(!showSearch)}>
                  <Search size={22} />
                </button>

                {/* CART */}
                <Link href="/cart" className="relative">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-1 -right-1 text-[8px] text-white bg-red-500 size-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>

                {/* PROFILE */}
                {user ? (
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        labelIcon={<PackageIcon size={16} />}
                        label="My Orders"
                        onClick={() => router.push("/orders")}
                      />

                      {isAdmin && (
                        <UserButton.Action
                          labelIcon={<LayoutDashboardIcon size={16} />}
                          label="Admin Dashboard"
                          onClick={() => router.push("/admin")}
                        />
                      )}

                      {isSeller && (
                        <UserButton.Action
                          labelIcon={<StoreIcon size={16} />}
                          label="My Store"
                          onClick={() => router.push("/store")}
                        />
                      )}
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <button
                    onClick={openSignIn}
                    className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-full"
                  >
                    Login
                  </button>
                )}
              </>
            )}

            {/* HAMBURGER (SELALU ADA) */}
            <button onClick={() => setOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
      {/* MOBILE SEARCH BAR */}
      {showSearch && (
        <div className="sm:hidden px-6 pb-4">
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setShowSearch(false);
            }}
            className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-full"
          >
            <Search size={18} />
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Cari produk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              required
            />
          </form>
        </div>
      )}

      <hr className="border-gray-300" />
      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
    fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50
    transform transition-transform duration-300 ease-in-out
    sm:hidden
    ${open ? "translate-x-0" : "translate-x-full"}
  `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <div className="px-6 py-6 space-y-6 text-slate-700 text-base">
          {/* USER INFO */}
          {user ? (
            <div className="flex items-start gap-3 border-b pb-4">
              <UserButton />

              <div className="flex flex-col gap-1">
                <p className="font-medium leading-tight">{user.firstName}</p>

                <button
                  onClick={() => {
                    router.push("/orders");
                    setOpen(false);
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 transition text-left"
                >
                  My Orders
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      router.push("/admin");
                      setOpen(false);
                    }}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold transition text-left"
                  >
                    Admin Dashboard
                  </button>
                )}

                {isSeller && (
                  <button
                    onClick={() => {
                      router.push("/store");
                      setOpen(false);
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition text-left"
                  >
                    My Store
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                openSignIn();
                setOpen(false);
              }}
              className="w-full py-2 bg-red-500 text-white rounded-full"
            >
              Login
            </button>
          )}

          {/* CART */}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart
            </span>
            <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </Link>

          <hr />

          {/* NAV LINKS */}
          <Link href="/" onClick={() => setOpen(false)} className="block">
            Home
          </Link>

          <Link href="/shop" onClick={() => setOpen(false)} className="block">
            Shop
          </Link>

          <Link href="/about" onClick={() => setOpen(false)} className="block">
            About
          </Link>

          <Link href="#footer" onClick={() => setOpen(false)} className="block">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
