"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  name: string;
  image: string;
  stock: number;
}

export default function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLowStockProducts();
  }, []);

  async function getLowStockProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id, name, image, stock")
      .order("stock", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const lowStock = (data || []).filter(
      (product) => product.stock <= 10
    );

    setProducts(lowStock);
    setLoading(false);
  }

  function getStatus(stock: number) {
    if (stock <= 3) {
      return {
        text: "Critical",
        color: "text-red-600",
      };
    }

    if (stock <= 10) {
      return {
        text: "Low Stock",
        color: "text-yellow-600",
      };
    }

    return {
      text: "In Stock",
      color: "text-green-600",
    };
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Low Stock Alerts
        </h1>

        <p className="text-gray-500 mt-2">
          Products that need to be restocked.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-center p-4">Stock</th>
              <th className="text-right p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-8">
                  No low-stock products 🎉
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getStatus(product.stock);

                return (
                  <tr
                    key={product.id}
                    className="border-t"
                  >
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded object-cover"
                      />

                      <span className="font-medium">
                        {product.name}
                      </span>
                    </td>

                    <td className="text-center font-semibold">
                      {product.stock}
                    </td>

                    <td
                      className={`text-right pr-4 font-bold ${status.color}`}
                    >
                      {status.text}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
