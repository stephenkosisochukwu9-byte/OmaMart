"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/components/context/SearchContext";
import Link from "next/link";
import ProductGrid from "@/components/ui/ProductGrid";

export default function Products() {
  const { addToCart } = useCart();

 const [products, setProducts] = useState<any[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  // Search & Filters
const { search, setSearch } = useSearch();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

 useEffect(() => {
  console.log("useEffect running");
  getProducts();
}, []);

  async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

    console.log("Supabase data:", data);
console.log("Supabase error:", error);


 if (error) {
  alert(error.message);
  console.error(error);
  return;
}

  console.log("Setting products:", data);
setProducts(data || []);

setTimeout(() => {
  console.log("Products after state update");
}, 1000);
}

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  const filteredProducts = useMemo(() => {
    console.log("Products:", products);
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
console.log("Search:", search);
console.log("Category:", category);
console.log("Sort:", sort);
console.log("Filtered:", data.length);

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
          <h2 className="text-4xl font-bold text-gray-600">
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

     <ProductGrid products={filteredProducts} />

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
        