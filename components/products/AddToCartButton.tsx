"use client";

import { useState } from "react";
import { useCart } from "@/components/context/CartContext";

interface Props {
  product: any;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition"
      >
        Add to Cart
      </button>

      {added && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ Product added to cart
        </p>
      )}
    </>
  );
}