"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/uploadImage";

export default function EditProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  async function getProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      alert("Failed to load product.");
      return;
    }

    setProduct(data);
  }

  async function updateProduct() {
    try {
      setLoading(true);

      let imageUrl = product.image;

      // Upload a new image only if the user selected one
      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          category: product.category,
          price: Number(product.price),
          old_price: Number(product.old_price),
          stock: Number(product.stock),
          image: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      alert("Product updated successfully!");

      getProduct();
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  }
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">
          Edit Product
        </h1>

        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Product
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

        {/* Current Image */}

        <div>

          <label className="block font-semibold mb-3">
            Current Product Image
          </label>

          <img
            src={product.image}
            alt={product.name}
            className="w-52 h-52 object-cover rounded-xl border"
          />

        </div>

        {/* Upload New Image */}

        <div>

          <label className="block font-semibold mb-2">
            Replace Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setNewImage(e.target.files[0]);
              }
            }}
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Product Name */}

        <div>

          <label className="block font-semibold mb-2">
            Product Name
          </label>

          <input
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Description */}

        <div>

          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3 h-32"
          />

        </div>

        {/* Category */}

        <div>

          <label className="block font-semibold mb-2">
            Category
          </label>

          <input
            value={product.category}
            onChange={(e) =>
              setProduct({
                ...product,
                category: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Price */}

        <div className="grid md:grid-cols-3 gap-5">

          <div>

            <label className="block font-semibold mb-2">
              Price
            </label>

            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Old Price
            </label>

            <input
              type="number"
              value={product.old_price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  old_price: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Stock
            </label>

            <input
              type="number"
              value={product.stock}
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <button
          onClick={updateProduct}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}