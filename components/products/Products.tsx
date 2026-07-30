"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/components/context/SearchContext";

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {filteredProducts.map((product) => (
           

  <div
    key={product.id}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
  >

    <div className="relative bg-gray-100 h-56 flex items-center justify-center">

      <Image
        src={product.image}
        alt={product.name}
        width={180}
        height={180}
        className="object-contain group-hover:scale-105 transition"
        unoptimized
      />

     

    </div>

    <div className="p-5">

      <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
        {product.category}
      </span>

      <h3 className="font-bold text-lg mt-3">
        {product.name}
      </h3>

      <div className="flex items-center mt-2">

        <Star
          size={16}
          className="text-yellow-400 fill-yellow-400"
        />

        <span className="ml-2 text-gray-600">
          {product.rating}
        </span>

      </div>

      <div className="flex items-center gap-3 mt-3">

        <span className="text-2xl font-bold text-orange-500">
          ₦{Number(product.price).toLocaleString()}
        </span>

        <span className="line-through text-gray-400">
          ₦{Number(product.old_price).toLocaleString()}
        </span>

      </div>

      <p className="text-sm text-green-600 mt-2">
        {Number(product.stock)} in stock
      </p>

      {Number(product.stock) <= 0 ? (
  <button
    disabled
    className="w-full mt-5 bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
  >
    Out of Stock
  </button>
) : (
  <button
  disabled={Number(product.stock) <= 0}
    onClick={() => {
     addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  stock: product.stock,
});
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }}
    className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold ${
  Number(product.stock) <= 0
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-orange-500 hover:bg-orange-600 text-white"
}`}
  >
   <>
  <ShoppingCart size={18} />
  Add to Cart
</>
  </button>
)}

    </div>

  </div>

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
        