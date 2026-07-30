"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [copiedRef, setCopiedRef] = useState<number | null>(null);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  }

  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-green-100 text-green-700";
    }
  }

  async function copyReference(reference: string, orderId: number) {
    try {
      await navigator.clipboard.writeText(reference);

      setCopiedRef(orderId);

      setTimeout(() => {
        setCopiedRef(null);
      }, 2000);
    } catch {
      alert("Unable to copy payment reference.");
    }
  }

  function getItemCount(items: any[]) {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="mt-6 text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-10">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Your orders will appear here after your first purchase.
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg border overflow-hidden"
            >

              {/* Header */}

              <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                </div>

                <div className="flex items-center gap-3 mt-5 lg:mt-0">

                  <span
                    className={`px-4 py-2 rounded-full font-semibold capitalize ${getStatusColor(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status}
                  </span>

                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id
                          ? null
                          : order.id
                      )
                    }
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition"
                  >
                    {expandedOrder === order.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>

                </div>

              </div>

              <div className="px-6 pb-6 grid md:grid-cols-3 gap-5">

                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-bold text-lg">
                    ₦{Number(order.total).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-bold">
                    {getItemCount(order.items)} item(s)
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-bold">
                    {order.phone}
                  </p>
                </div>

              </div>

              {expandedOrder === order.id && (

                <div className="border-t bg-gray-50 p-6">

                  <h3 className="text-xl font-bold mb-5">
                    Ordered Items
                  </h3>

                  <div className="space-y-4">

                    {order.items?.map((item: any, index: number) => (

                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-xl border p-4"
                      >

                        <div className="flex items-center gap-4">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover"
                          />

                          <div>

                            <h4 className="font-bold">
                              {item.name}
                            </h4>
                            <p className="text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                            <p className="text-orange-500 font-semibold">
                              ₦{Number(item.price).toLocaleString()} each
                            </p>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="font-bold text-lg">
                            ₦{Number(
                              item.price * item.quantity
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="mt-8 grid md:grid-cols-2 gap-8">

                    <div>

                      <h3 className="font-bold text-lg">
                        📍 Delivery Address
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {order.address}
                      </p>

                      <p className="text-gray-600">
                        {order.city}, {order.state}
                      </p>

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        Payment Reference
                      </h3>

                      <div className="flex items-center gap-3 mt-2">

                        <code className="bg-white border rounded-lg px-3 py-2">
                          {order.payment_reference}
                        </code>

                        <button
                          onClick={() =>
                            copyReference(
                              order.payment_reference,
                              order.id
                            )
                          }
                          className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-lg text-sm"
                        >
                          {copiedRef === order.id
                            ? "Copied!"
                            : "Copy"}
                        </button>

                      </div>

                    </div>

                  </div>

                  <div className="mt-8 border-t pt-6">

                    <div className="flex justify-between mb-3">

                      <span>Subtotal</span>

                      <span>
                        ₦{Number(order.subtotal).toLocaleString()}
                      </span>

                    </div>

                    <div className="flex justify-between mb-3">

                      <span>Delivery Fee</span>

                      <span>
                        ₦{Number(order.delivery_fee).toLocaleString()}
                      </span>

                    </div>

                    <div className="flex justify-between text-xl font-bold text-orange-500 border-t pt-4">

                      <span>Total</span>

                      <span>
                        ₦{Number(order.total).toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </main>
  );
}