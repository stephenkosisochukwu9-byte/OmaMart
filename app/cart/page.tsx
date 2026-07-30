"use client";

import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 2500 : 0;

  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-lg w-full">

          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart size={48} className="text-orange-500" />
          </div>

          <h1 className="text-3xl font-bold mt-8 text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600 mt-4 text-gray-900">
            Looks like you haven't added any products to your cart yet.
          </p>

          <Link
            href="/"
            className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition"
          >
            Start Shopping
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}

        <div className="lg:col-span-2 space-y-6">

          {cart.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-6 flex items-center justify-between"
            >

              <div className="flex items-center gap-5">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div>

                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-orange-500 font-semibold mt-2">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>

                  </div>

                </div>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-orange-500">
                  ₦{Number(item.price * item.quantity).toLocaleString()}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-5 flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Order Summary */}

        <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-24">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>
          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>

            <span className="text-orange-500">
              ₦{total.toLocaleString()}
            </span>
          </div>
<Link
  href="/"
  className="block w-full mb-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-4 rounded-xl font-semibold text-center transition"
>
  Continue Shopping
</Link>
          <Link
  href="/checkout"
  className="block w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-center transition"
>
  Proceed to Checkout
</Link>
        </div>

      </div>

    </main>
  );
}