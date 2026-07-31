"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/components/context/SearchContext";
import Link from "next/link";

export default function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  // Search & Filters
const { search, setSearch } = useSearch();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (search.trim() !== "") {
      data = data.filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter(
        (product) => product.category === category
      );
    }

    switch (sort) {
      case "Low":
        data.sort((a, b) => a.price - b.price);
        break;

      case "High":
        data.sort((a, b) => b.price - a.price);
        break;

      default:
        data.sort((a, b) => b.id - a.id);
    }

    return data;
  }, [products, search, category, sort]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      {showMessage && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-bounce">
          ✅ Product added to cart
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            Best Selling Products
          </h2>

          <p className="text-gray-500 mt-2">
            Top quality electrical appliances and household essentials.
          </p>
        </div>

        <button className="text-orange-500 font-semibold hover:text-orange-600">
          View All →
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl p-4"
        >
          {categories.map((cat) => (
            <option key={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option value="Newest">Newest</option>
          <option value="Low">Price: Low → High</option>
          <option value="High">Price: High → Low</option>
        </select>

      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 gap-3 px-2">

        {filteredProducts.map((product) => (
           

  <Link
  href={`/products/${product.id}`}
  key={product.id}
  className="block w-full max-w-[170px] mx-auto bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
>

    <div className="relative bg-gray-100 h-20 overflow-hidden flex items-center justify-center">

   <Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width:768px) 100vw, 25vw"
  className="object-contain p-2 group-hover:scale-105 transition duration-300"
  unoptimized
/>
     

    </div>

    <div className="p-2 text-gray-900 space-y-1">

     <span
  style={{ color: "#c2410c" }}
  className="text-xs font-semibold bg-orange-100 px-2 py-1 rounded-full"
>
  {product.category
  ?.split(" ")
  .map((word: string) =>
    word.charAt(0).toUpperCase() +
    word.slice(1).toLowerCase()
  )
  .join(" ")}
</span>
     <h3
 className="text-gray-900 text-base font-semibold mt-2 leading-tight h-9 overflow-hidden"
>
  {product.name.length > 22
  ? `${product.name.substring(0, 22)}...`
  : product.name}
</h3>

     

      <div className="flex items-center gap-2 mt-0">

        <span className="text-xl font-extrabold text-orange-500">
          ₦{Number(product.price).toLocaleString()}
        </span>

        <span className="line-through text-gray-500 text-sm">
          ₦{Number(product.old_price).toLocaleString()}
        </span>

      </div>

     

     
    </div>

  </Link>

))}

      </div>

      {filteredProducts.length === 0 && (

        <div className="text-center py-20">

          <h3 className="text-2xl font-bold text-gray-600">
            No products found
          </h3>

          <p className="text-gray-500 mt-3">
            Try a different search term or category.
          </p>

        </div>

      )}

    </section>
  );
}
        