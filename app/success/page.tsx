"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-xl w-full text-center">

        <CheckCircle
          size={90}
          className="text-green-500 mx-auto"
        />

        <h1 className="text-4xl font-bold mt-8">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mt-5 text-lg">
          Thank you for shopping with OmaMart.
          Your order has been received successfully and is being processed.
        </p>

       <div className="mt-10 space-y-4">

  <Link
    href="/"
    className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition"
  >
    Continue Shopping
  </Link>

  <Link
    href="/"
    className="block w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-4 rounded-xl font-semibold transition"
  >
    Back to Home
  </Link>

</div>

      </div>

    </main>
  );
}
