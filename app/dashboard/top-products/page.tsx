"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProductStats {
  id: number;
  name: string;
  image: string;
  quantity: number;
  revenue: number;
}

export default function TopProductsPage() {
  const [products, setProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopProducts();
  }, []);

  async function getTopProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("items, payment_status");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const summary: Record<number, ProductStats> = {};

    data
      ?.filter((order) => order.payment_status === "paid")
      .forEach((order) => {
        const items = order.items || [];

        items.forEach((item: any) => {
          if (!summary[item.id]) {
            summary[item.id] = {
              id: item.id,
              name: item.name,
              image: item.image,
              quantity: 0,
              revenue: 0,
            };
          }

          summary[item.id].quantity += item.quantity;
          summary[item.id].revenue += item.price * item.quantity;
        });
      });

    const sortedProducts = Object.values(summary).sort(
      (a, b) => b.quantity - a.quantity
    );

    setProducts(sortedProducts);
    setLoading(false);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Top Selling Products
        </h1>

        <p className="text-gray-500 mt-2">
          See which products generate the most sales.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-center p-4">Units Sold</th>
              <th className="text-right p-4">Revenue</th>
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
                  No sales yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
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
                    {product.quantity}
                  </td>

                  <td className="text-right pr-4 font-bold text-green-600">
                    ₦{product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}