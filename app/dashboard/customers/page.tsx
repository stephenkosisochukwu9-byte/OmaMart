"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CustomersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCustomers();
  }, []);

  async function getCustomers() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setOrders(data || []);
  }

  const customers = useMemo(() => {
    const grouped = new Map();

    orders.forEach((order) => {
      const email = order.email;

      if (!grouped.has(email)) {
        grouped.set(email, {
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          state: order.state,
          orders: 0,
          spent: 0,
        });
      }

      const customer = grouped.get(email);

      customer.orders += 1;
      customer.spent += Number(order.total);
    });

    return Array.from(grouped.values()).filter((customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <main className="max-w-7xl mx-auto p-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Customers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage and monitor your customers.
          </p>

        </div>

        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Customers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {customers.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {orders.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Customer Revenue
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">
            ₦{customers
              .reduce(
                (sum, customer) => sum + customer.spent,
                0
              )
              .toLocaleString()}
          </h2>

        </div>

      </div>

      {/* Customers */}

      <div className="space-y-6">

        {customers.map((customer, index) => (
            <div
            key={index}
            className="bg-white rounded-2xl shadow border p-6"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <h2 className="text-2xl font-bold">
                  {customer.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {customer.email}
                </p>

                <p className="mt-2">
                  📞 {customer.phone}
                </p>

                <p className="mt-2">
                  📍 {customer.address}
                </p>

                <p className="text-gray-500">
                  {customer.city}, {customer.state}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div className="bg-gray-50 rounded-xl p-5 text-center">

                  <p className="text-gray-500">
                    Orders
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {customer.orders}
                  </h3>

                </div>

                <div className="bg-gray-50 rounded-xl p-5 text-center">

                  <p className="text-gray-500">
                    Total Spent
                  </p>

                  <h3 className="text-2xl font-bold text-green-600 mt-2">
                    ₦{customer.spent.toLocaleString()}
                  </h3>

                </div>

              </div>

            </div>

            <div className="mt-6 flex justify-end">

             <Link
  href={`/dashboard/orders?customer=${encodeURIComponent(
    customer.email
  )}`}
  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
>
  View Orders
</Link>

            </div>

          </div>
          ))}

        {customers.length === 0 && (

          <div className="bg-white rounded-2xl shadow border p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Customers Found
            </h2>

            <p className="text-gray-500 mt-3">
              There are no customers matching your search.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}
