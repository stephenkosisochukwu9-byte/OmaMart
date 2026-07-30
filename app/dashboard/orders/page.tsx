"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

  function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const customerEmail = searchParams.get("customer");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [expandedOrder, setExpandedOrder] =
    useState<number | null>(null);

 useEffect(() => {
  getOrders();
}, [customerEmail]);

  async function getOrders() {
    setLoading(true);

    let query = supabase
  .from("orders")
  .select("*");

if (customerEmail) {
  query = query.eq("email", customerEmail);
}

const { data, error } = await query.order("id", {
  ascending: false,
});
    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        order.order_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = filteredOrders.length;

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const pendingOrders = filteredOrders.filter(
    (order) => order.order_status === "Pending"
  ).length;

  const processingOrders = filteredOrders.filter(
    (order) => order.order_status === "Processing"
  ).length;

  const shippedOrders = filteredOrders.filter(
    (order) => order.order_status === "Shipped"
  ).length;

  const deliveredOrders = filteredOrders.filter(
    (order) => order.order_status === "Delivered"
  ).length;

  const cancelledOrders = filteredOrders.filter(
    (order) => order.order_status === "Cancelled"
  ).length;

  function getStatusColor(status: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getItemCount(items: any[]) {
    if (!items) return 0;

    return items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    console.log("Updating order id:", id);
    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
      })
      .eq("id", id)
      .select();
      console.log(data);
console.log(error);
      

   if (error) {
  alert(error.message);
  console.error(error);
  return;
}

alert("Status updated successfully");
getOrders();
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold">
          Customer Orders
        </h1>

        <div className="mt-10 text-gray-500">
          Loading orders...
        </div>

      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Customer Orders
          </h1>

          <p className="text-gray-500 mt-2">
            View, manage and track every customer order.
          </p>

        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Total Orders
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {totalOrders}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            ₦{totalRevenue.toLocaleString()}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Pending Orders
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-3">
            {pendingOrders}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Processing
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {processingOrders}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Shipped
          </p>

          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            {shippedOrders}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500">
            Delivered
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {deliveredOrders}
          </h2>

        </div>

      </div>

      {/* Orders */}

      <div className="space-y-6">

        {filteredOrders.map((order) => (
            <div
            key={order.id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          >

            {/* Order Header */}

            <div className="p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Order #{order.id}
                </h2>

                <p className="text-gray-500 mt-2">
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <div className="mt-5 space-y-2">

                  <p>
                    <span className="font-semibold">
                      Customer:
                    </span>{" "}
                    {order.customer_name}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Email:
                    </span>{" "}
                    {order.email}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Phone:
                    </span>{" "}
                    {order.phone}
                  </p>

                </div>

              </div>

              <div className="flex flex-col items-start xl:items-end gap-4">

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {order.order_status}
                </span>

                <div className="text-right">

                  <p className="text-gray-500">
                    Order Total
                  </p>

                  <h3 className="text-3xl font-bold text-orange-600">
                    ₦{Number(order.total).toLocaleString()}
                  </h3>

                </div>

                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id
                        ? null
                        : order.id
                    )
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  {expandedOrder === order.id
                    ? "Hide Details"
                    : "View Details"}
                </button>

              </div>

            </div>

            {expandedOrder === order.id && (

              <div className="border-t bg-gray-50 p-6">

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Customer Information */}

                  <div>

                    <h3 className="text-xl font-bold mb-5">
                      Customer Information
                    </h3>

                    <div className="bg-white rounded-xl border p-5 space-y-4">

                      <div>
                        <p className="text-sm text-gray-500">
                          Full Name
                        </p>

                        <p className="font-semibold">
                          {order.customer_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Email Address
                        </p>

                        <p className="font-semibold break-all">
                          {order.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Phone Number
                        </p>

                        <p className="font-semibold">
                          {order.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Address
                        </p>

                        <p className="font-semibold">
                          {order.address}
                        </p>

                        <p className="text-gray-600">
                          {order.city}, {order.state}
                        </p>

                        <p className="text-gray-600">
                          {order.postal_code}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Order Management */}

                  <div>

                    <h3 className="text-xl font-bold mb-5">
                      Order Management
                    </h3>

                    <div className="bg-white rounded-xl border p-5 space-y-6">

                      <div>

                        <label className="block text-sm text-gray-500 mb-2">
                          Order Status
                        </label>

                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="w-full border rounded-xl px-4 py-3"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Payment Status
                        </p>

                        <span
  className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${
    order.payment_status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {order.payment_status}
</span>

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Payment Reference
                        </p>

                        <p className="font-mono text-sm break-all mt-2">
                          {order.
                          payment_reference}
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Total Items
                        </p>

                        <p className="text-2xl font-bold mt-2">
                          {getItemCount(order.items)}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Ordered Products */}

                <div className="mt-10">

                  <h3 className="text-2xl font-bold mb-6">
                    Ordered Products
                  </h3>

                  <div className="space-y-5">
                    {order.items?.map(
                      (item: any, index: number) => (

                        <div
                          key={index}
                          className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row gap-5"
                        >

                          <div className="flex-shrink-0">

                          <img
  src={item.image}
  alt={item.name}
  className="w-[120px] h-[120px] rounded-xl object-cover border"
/>

                          </div>

                          <div className="flex-1">

                            <h4 className="text-xl font-bold">
                              {item.name}
                            </h4>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5">

                              <div>

                                <p className="text-sm text-gray-500">
                                  Unit Price
                                </p>

                                <p className="font-semibold text-orange-600">
                                  ₦
                                  {Number(
                                    item.price
                                  ).toLocaleString()}
                                </p>

                              </div>

                              <div>

                                <p className="text-sm text-gray-500">
                                  Quantity
                                </p>

                                <p className="font-semibold">
                                  {item.quantity}
                                </p>

                              </div>

                              <div>

                                <p className="text-sm text-gray-500">
                                  Total
                                </p>

                                <p className="font-bold text-green-600">
                                  ₦
                                  {(
                                    Number(item.price) *
                                    Number(item.quantity)
                                  ).toLocaleString()}
                                </p>

                              </div>

                              <div>

                                <p className="text-sm text-gray-500">
                                  Availability
                                </p>

                                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                  Ordered
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* Invoice Summary */}

                <div className="mt-10">

                  <h3 className="text-2xl font-bold mb-6">
                    Invoice Summary
                  </h3>

                  <div className="bg-white border rounded-2xl p-6">
                    <div className="space-y-4">

                      <div className="flex justify-between items-center">

                        <span className="text-gray-500">
                          Items
                        </span>

                        <span className="font-semibold">
                          {getItemCount(order.items)}
                        </span>

                      </div>

                      <div className="flex justify-between items-center">

                        <span className="text-gray-500">
                          Subtotal
                        </span>

                        <span className="font-semibold">
                          ₦{Number(order.subtotal).toLocaleString()}
                        </span>

                      </div>

                      <div className="flex justify-between items-center">

                        <span className="text-gray-500">
                          Delivery Fee
                        </span>

                        <span className="font-semibold">
                          ₦{Number(order.delivery_fee).toLocaleString()}
                        </span>

                      </div>

                      <div className="border-t pt-4 flex justify-between items-center">

                        <span className="text-xl font-bold">
                          Grand Total
                        </span>

                        <span className="text-2xl font-bold text-orange-600">
                          ₦{Number(order.total).toLocaleString()}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Order Information */}

                <div className="mt-10">

                  <h3 className="text-2xl font-bold mb-6">
                    Order Information
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white border rounded-xl p-5">

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="text-xl font-bold mt-2">
                        #{order.id}
                      </p>

                    </div>

                    <div className="bg-white border rounded-xl p-5">

                      <p className="text-sm text-gray-500">
                        Order Date
                      </p>

                      <p className="font-semibold mt-2">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <div className="bg-white border rounded-xl p-5">

                      <p className="text-sm text-gray-500">
                        Customer Email
                      </p>

                      <p className="font-semibold break-all mt-2">
                        {order.email}
                      </p>

                    </div>

                    <div className="bg-white border rounded-xl p-5">

                      <p className="text-sm text-gray-500">
                        Customer Phone
                      </p>

                      <p className="font-semibold mt-2">
                        {order.phone}
                      </p>

                    </div>

                  </div>

                </div>
                {/* Quick Actions */}

                <div className="mt-10">

                  <h3 className="text-2xl font-bold mb-6">
                    Quick Actions
                  </h3>

                  <div className="flex flex-wrap gap-4">

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          order.payment_reference || ""
                        )
                      }
                      className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
                    >
                      Copy Payment Reference
                    </button>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="px-5 py-3 border rounded-xl font-semibold hover:bg-gray-100 transition"
                    >
                      Print Invoice
                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        ))}

        {filteredOrders.length === 0 && (

          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-3">
              There are no customer orders matching your current search or filter.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}