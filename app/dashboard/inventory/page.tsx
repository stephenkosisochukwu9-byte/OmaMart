"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function InventoryPage() {

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

    useEffect(() => {
    getProducts();
}, []);
async function getProducts() {
    setLoading(true);

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    setProducts(data || []);
    setLoading(false);
}
const totalProducts = products.length;

const totalUnits = products.reduce(
    (sum, product) => sum + product.stock,
    0
);

const inventoryValue = products.reduce(
    (sum, product) => sum + (product.price * product.stock),
    0
);

const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 10
).length;

const outOfStock = products.filter(
    (product) => product.stock === 0
).length;
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold">Inventory Management</h1>
<div className="mt-6 mb-8">
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
  />
</div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">

    <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Products</p>
        <h2 className="text-3xl font-bold mt-2">
            {totalProducts}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Units</p>
        <h2 className="text-3xl font-bold mt-2">
            {totalUnits}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Inventory Value</p>
        <h2 className="text-3xl font-bold mt-2 text-green-600">
            ₦{inventoryValue.toLocaleString()}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Low Stock</p>
        <h2 className="text-3xl font-bold mt-2 text-orange-500">
            {lowStock}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Out of Stock</p>
        <h2 className="text-3xl font-bold mt-2 text-red-500">
            {outOfStock}
        </h2>
    </div>

</div>
<div className="bg-white rounded-2xl shadow mt-10">

    <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">
            Inventory
        </h2>
    </div>

</div>
<div className="grid grid-cols-6 gap-4 px-6 py-4 font-semibold text-gray-600 border-b">

    <div>Product</div>

    <div>Category</div>

    <div>Price</div>

    <div>Stock</div>

    <div>Status</div>

    <div>Value</div>

</div>
{filteredProducts.map((product) => (

    <div
        key={product.id}
        className="grid grid-cols-6 gap-4 px-6 py-5 border-b items-center"
    >

        <div className="flex items-center gap-4">

    <img
        src={product.image}
        alt={product.name}
        className="w-14 h-14 rounded-lg object-cover"
    />

    <span className="font-medium">
        {product.name}
    </span>

</div>

        <div className="text-gray-600">
            {product.category}
        </div>

        <div>
            ₦{product.price.toLocaleString()}
        </div>

        <div>
            {product.stock}
        </div>

        <div>
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : product.stock <= 10
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                }`}
            >
                {product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 10
                    ? "Low Stock"
                    : "Healthy"}
            </span>
        </div>

        <div className="font-semibold text-green-600">
            ₦{(product.price * product.stock).toLocaleString()}
        </div>

    </div>

))}
    </main>
  );
}
