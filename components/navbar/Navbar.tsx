"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LogOut,
  Package,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { useSearch } from "@/components/context/SearchContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();

const [user, setUser] = useState<any>(null);
const [showMenu, setShowMenu] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

useEffect(() => {
  checkUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

async function checkUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);
}

async function logout() {
  await supabase.auth.signOut();
  router.push("/");
}
  const { search, setSearch } = useSearch();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold cursor-pointer"
        >
          <span className="text-blue-700">Oma</span>
          <span className="text-orange-500">Mart</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-700">
         <Link
  href="/"
  className="hover:text-orange-500 transition"
>
  Home
</Link>

<Link
  href="/products"
  className="hover:text-orange-500 transition"
>
  Shop
</Link>

<Link
  href="/categories"
  className="hover:text-orange-500 transition"
>
  Categories
</Link>

<Link
  href="/contact"
  className="hover:text-orange-500 transition"
>
  Contact
</Link>
        </nav>

        {/* Search Box */}

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">

          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none ml-3 w-full text-sm"
          />

        </div>

        {/* Icons */}

        <div className="flex items-center gap-5">

          

          <Link
            href="/cart"
            className="relative hover:text-orange-500 transition"
          >
           <ShoppingCart
  size={24}
  className="text-gray-700 hover:text-orange-500"
/>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}

          </Link>

        <div className="relative">

  {user ? (

    <button
  onClick={() => setShowMenu(!showMenu)}
  className="flex items-center gap-2 hover:text-orange-500 transition"
>

     <User
  size={24}
  className="text-gray-700 hover:text-orange-500 transition"
/>

      <span className="hidden lg:block font-medium">
  {user.user_metadata?.full_name || "Account"}
</span>

    </button>

  ) : (

    <Link
      href="/login"
      className="flex items-center gap-2 hover:text-orange-500 transition"
    >

      <User
  size={24}
  className="text-gray-700 hover:text-orange-500 transition"
/>

      <span className="hidden lg:block">
        Account
      </span>

    </Link>

  )}

  {user &&  showMenu && (

    <div
  ref={menuRef}
  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50"
>

     <div className="p-4 border-b overflow-hidden">

       <p className="font-bold">
  {user.user_metadata?.full_name || "Customer"}
</p>
   <p className="text-sm text-gray-500">
  Premium Member
</p>

      </div>

      <Link
  href="/profile"
  className="mx-2 mt-2 flex items-center justify-between rounded-xl px-4 py-3 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
>
  <div className="flex items-center gap-3">
    <User size={18} />
    <span className="font-medium">My Profile</span>
  </div>

  <ChevronRight size={18} />
</Link>
      <Link
  href="/orders"
  className="mx-2 flex items-center justify-between rounded-xl px-4 py-3 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
>
  <div className="flex items-center gap-3">
    <Package size={18} />
    <span className="font-medium">My Orders</span>
  </div>

  <ChevronRight size={18} />
</Link>
      <button
        onClick={logout}
        className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
      >
        Logout
      </button>

    </div>

  )}

</div>
          <button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <Menu
    size={24}
    className="text-gray-700 hover:text-orange-500 transition"
  />
</button>
        </div>

      </div>
      {mobileMenuOpen && (
  <div className="md:hidden bg-white border-t shadow-lg">
    <Link
      href="/"
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      Home
    </Link>

    <Link
      href="/products"
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      Shop
    </Link>

    <Link
      href="/categories"
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      Categories
    </Link>

    <Link
      href="/cart"
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      Cart
    </Link>

    <Link
      href="/contact"
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      Contact
    </Link>

    <Link
      href={user ? "/profile" : "/login"}
      onClick={() => setMobileMenuOpen(false)}
      className="block px-6 py-4 hover:bg-gray-100"
    >
      {user ? "My Account" : "Login"}
    </Link>
  </div>
)}
    </header>
  );
}