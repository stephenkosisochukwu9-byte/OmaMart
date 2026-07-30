"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import {
  FaBlender,
  FaUtensils,
  FaPumpSoap,
  FaBath,
  FaBoxOpen,
  FaHome,
} from "react-icons/fa";

export default function Categories() {

  const defaultCategories = [
    {
      name: "Kitchen Appliances",
      icon: <FaBlender className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
    {
      name: "Cookware",
      icon: <FaUtensils className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
    {
      name: "Cleaning Supplies",
      icon: <FaPumpSoap className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
    {
      name: "Bathroom Essentials",
      icon: <FaBath className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
    {
      name: "Storage & Organizers",
      icon: <FaBoxOpen className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
    {
      name: "Household Essentials",
      icon: <FaHome className="text-5xl text-orange-500 mx-auto mb-4" />,
    },
  ];
  const [categories, setCategories] = useState<any[]>([]);

useEffect(() => {
  fetchCategories();
}, []);

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  setCategories(data || []);
}

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Shop by Category</h2>

        <p className="mt-4 text-gray-600">
          Find everything you need for your home.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
        {categories.map((item) => (
         <Link
  href={`/categories/${item.slug}`}
  key={item.id}
  className="bg-white rounded-xl shadow-md border p-8 text-center hover:shadow-xl transition block"
>
            <img
  src={item.image}
  alt={item.name}
  className="w-24 h-24 object-cover rounded-xl mx-auto mb-4"
/>

            <h3 className="text-lg font-semibold">
              {item.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}