"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100">

        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <h1 className="text-5xl font-bold">
              Our Products
            </h1>

            <p className="mt-4 text-blue-100 text-lg">
              Browse quality home appliances and household essentials at affordable prices.
            </p>

          </div>
        </section>

        {/* Products */}

        <section className="max-w-7xl mx-auto px-6 py-16">

          {loading ? (
            <div className="text-center text-xl">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 text-xl">
              No products available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {products.map((product) => (

                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-5">

                    <h2 className="font-bold text-lg">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {product.category}
                    </p>

                    <p className="text-orange-600 text-2xl font-bold mt-4">
                      ₦{Number(product.price).toLocaleString()}
                    </p>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}
