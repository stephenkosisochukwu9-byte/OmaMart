"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeProfile();
  }, []);

  async function initializeProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);
    setFullName(user.user_metadata?.full_name || "");

    await loadProfile(user.id, user);
  }

  async function loadProfile(userId: string, authUser: any) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!data) {
      await supabase.from("profiles").insert({
        id: userId,
        full_name: authUser.user_metadata?.full_name || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
      });

      return;
    }

    setPhone(data.phone || "");
    setAddress(data.address || "");
    setCity(data.city || "");
    setState(data.state || "");
    setPostalCode(data.postal_code || "");
  }
  async function updateProfile() {
    if (!user) return;

    setLoading(true);

    // Update Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    // Update Profiles Table
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        address,
        city,
        state,
        postal_code: postalCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser();

    setUser(updatedUser);

    alert("Profile updated successfully!");

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="bg-orange-500 h-44 flex items-center justify-center">

          <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-orange-500">

            {fullName
              ?.split(" ")
              .map((word: string) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}

          </div>

        </div>

        <div className="p-10">

          <h1 className="text-3xl font-bold text-center">
            {fullName}
          </h1>

          <p className="text-center text-gray-500 mt-2">
            {user?.email || ""}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
<div>
              <label className="font-semibold">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="font-semibold">
                Email Address
              </label>

              <input
                value={user?.email || ""}
                readOnly
                className="w-full mt-2 border rounded-xl p-4 bg-gray-100"
              />
            </div>

            <div>
              <label className="font-semibold">
                Phone Number
              </label>

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="font-semibold">
                State
              </label>

              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold">
                Delivery Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
                rows={4}
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="font-semibold">
                City
              </label>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="font-semibold">
                Postal Code
              </label>

              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                className="w-full mt-2 border rounded-xl p-4"
              />
            </div>

          </div>

          <button
            onClick={updateProfile}
            disabled={loading}
            className="mt-10 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </main>
  );
}
         