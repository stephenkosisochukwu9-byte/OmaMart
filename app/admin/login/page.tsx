"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

   const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

console.log("User:", data.user);
console.log("Session:", data.session);
console.log("Error:", error);

   setLoading(false);

if (error) {
  alert(error.message);
  return;
}

if (!isAdmin(data.user?.email)) {
  await supabase.auth.signOut();
  alert("Access denied. This account is not an administrator.");
  return;
}

router.push("/dashboard");
router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Sign in to access the OmaMart Dashboard
        </p>

        <form onSubmit={login} className="mt-8 space-y-5">

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </main>
  );
}