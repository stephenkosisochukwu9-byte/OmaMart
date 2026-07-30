"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
const [isEditing, setIsEditing] = useState(false);

useEffect(() => {
  getCategories();
}, []);

async function getCategories() {
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

async function saveCategory() {
 if (!name.trim()) {
  alert("Category name is required.");
  return;
}

const generatedSlug = name
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "");
  let imageUrl = "";

if (imageFile) {
  const fileName = `${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, imageFile);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}

  let error;

if (isEditing) {
  const { error: updateError } = await supabase
    .from("categories")
    .update({
      name,
      slug: generatedSlug,
      image: imageUrl || image,
    })
    .eq("id", editingId);

  error = updateError;
} else {
  const { error: insertError } = await supabase
    .from("categories")
    .insert([
      {
        name,
        slug: generatedSlug,
        image: imageUrl,
      },
    ]);

  error = insertError;
}

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  setName("");
setImage("");
setImageFile(null);

setEditingId(null);
setIsEditing(false);

setShowModal(false);

getCategories();
}
function editCategory(category: any) {
  setEditingId(category.id);
  setIsEditing(true);

  setName(category.name);
  setImage(category.image || "");
  setImageFile(null);

  setShowModal(true);
}
async function deleteCategory(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  getCategories();
}
  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Categories Management
          </h1>

          <p className="text-gray-500 mt-2">
            Create and manage your store categories
          </p>
        </div>

        <button
  onClick={() => setShowModal(true)}
  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
>
  + Add Category
</button>
      </div>

     <div className="bg-white rounded-2xl shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4">Image</th>
        <th className="text-left p-4">Category</th>
        <th className="text-left p-4">Slug</th>
        <th className="text-center p-4">Actions</th>
      </tr>
    </thead>

    <tbody>
      {categories.length === 0 ? (
        <tr>
          <td
            colSpan={4}
            className="text-center py-10 text-gray-500"
          >
            No categories found.
          </td>
        </tr>
      ) : (
        categories.map((category) => (
          <tr
            key={category.id}
            className="border-t hover:bg-gray-50"
          >
            <td className="p-4">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              )}
            </td>

            <td className="p-4 font-medium">
              {category.name}
            </td>

            <td className="p-4 text-gray-500">
              {category.slug}
            </td>

            <td className="p-4 text-center">
              <button
  onClick={() => editCategory(category)}
  className="text-blue-600 hover:underline mr-4"
>
  Edit
</button>
 <button
  onClick={() => deleteCategory(category.id)}
  className="text-red-600 hover:underline"
>
  Delete
</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Add Category
      </h2>

      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 mb-4"
      />

     
     <div className="mb-6">
  <label className="block mb-2 font-medium">
    Category Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files.length > 0) {
        setImageFile(e.target.files[0]);
      }
    }}
    className="w-full border rounded-lg px-4 py-3"
  />
</div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-2 rounded-lg border"
        >
          Cancel
        </button>

       <button
  onClick={saveCategory}
  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Save Category
</button>
      </div>

    </div>
  </div>
)}
    </main>
  );
}
