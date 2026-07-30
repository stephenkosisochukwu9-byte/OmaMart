"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import { Grid } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<
  {
    category: string;
    image: string;
    count: number;
  }[]
>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data, error } = await supabase
  .from("products")
  .select("category, image");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const grouped: {
  [key: string]: {
    category: string;
    image: string;
    count: number;
  };
} = {};

(data || []).forEach((item) => {
  if (!item.category) return;

  if (!grouped[item.category]) {
    grouped[item.category] = {
      category: item.category,
      image: item.image,
      count: 1,
    };
  } else {
    grouped[item.category].count++;
  }
});

setCategories(Object.values(grouped));
    setLoading(false);
  }

  function slugify(category: string) {
    return category
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-");
  }
  function capitalizeWords(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100">

        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <Grid
              className="mx-auto mb-5"
              size={50}
            />

            <h1 className="text-5xl font-bold">
              Browse Categories
            </h1>

            <p className="mt-4 text-blue-100 text-lg">
              Explore our collection of quality home products.
            </p>

          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 py-16">

          {loading ? (
            <div className="text-center text-xl">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500 text-xl">
              No categories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {categories.map((category) => (

                <Link
                  key={category.category}
                  href={`/categories/${slugify(category.category)}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-10 text-center"
                >
                 <div className="h-52 overflow-hidden rounded-xl">
  <img
    src={category.image}
    alt={category.category}
    className="w-full h-60 object-cover transition duration-500 group-hover:scale-110"
  />
</div>
                  <h2 className="text-2xl font-bold mt-5 text-blue-700">
                    {capitalizeWords(category.category)}
                  </h2>

                <div className="mt-3 space-y-2">

  <p className="text-orange-500 font-semibold">
    {category.count} Product{category.count > 1 ? "s" : ""}
  </p>

  <p className="text-blue-600 font-medium group-hover:text-orange-500 transition">
    Browse Category →
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
