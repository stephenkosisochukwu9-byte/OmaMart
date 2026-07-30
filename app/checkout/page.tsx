"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaystackPop from "@paystack/inline-js";
import { useCart } from "@/components/context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  getUser();
}, []);

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setUser(user);

  setName(user.user_metadata?.full_name || "");
  setEmail(user.email || "");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) {
    setPhone(data.phone || "");
    setAddress(data.address || "");
    setState(data.state || "");
    setCity(data.city || "");
    setPostalCode(data.postal_code || "");
  }
}

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 2500 : 0;

  const total = subtotal + deliveryFee;

  function payWithPaystack() {
    if (!name || !email || !phone || !state  || !address) {
      alert("Please fill in all customer information.");
      return;
    }

    const popup = new PaystackPop();

    popup.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount: total * 100,
      currency: "NGN",

      onSuccess: async (transaction: any) => {
        const { error } = await supabase
          .from("orders")
          .insert({
            customer_name: name,
            user_id: user?.id,
            email,
            phone,
            state,
            city,
            postal_code: postalCode,
            address,
            items: cart,
            subtotal,
            delivery_fee: deliveryFee,
            total,
            payment_reference: transaction.reference,
            payment_status: "paid",
          });

        if (error) {
  console.error(error);
  alert(error.message);
  return;
}
for (const item of cart) {
  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", item.id)
    .single();

  if (!product) continue;

  const newStock = Math.max(
    0,
    Number(product.stock) - Number(item.quantity)
  );

  await supabase
    .from("products")
    .update({
      stock: newStock,
    })
    .eq("id", item.id);
}

        clearCart();

        alert(
          "Payment successful!\nReference: " +
            transaction.reference
        );

        window.location.href = "/success";
      },

      onCancel: () => {
        alert("Payment cancelled.");
      },
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Customer Information */}

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold mb-6">
            Customer Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <textarea
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded-xl p-4 mt-6 w-full h-36 outline-none focus:ring-2 focus:ring-orange-500"
          />

        </div>

        {/* Order Summary */}

        <div className="bg-white rounded-2xl shadow p-8 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cart.map((item) => (

              <div
              key={item.id}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />

                  <div>

                    <p className="font-semibold text-sm">
                      {item.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Qty: {item.quantity}
                    </p>

                  </div>

                </div>

                <p className="font-semibold text-orange-500">
                  ₦{Number(item.price * item.quantity).toLocaleString()}
                </p>

              </div>

            ))}

          </div>

          <hr className="mb-6" />

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Delivery</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>

            <span className="text-orange-500">
              ₦{total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={payWithPaystack}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition"
          >
            Continue to Payment
          </button>

        </div>

      </div>

    </main>
  );
}