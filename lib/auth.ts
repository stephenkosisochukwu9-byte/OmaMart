import { supabase } from "@/lib/supabase";
import { isAdmin } from "./admin";

export async function requireAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Current user:", user);
console.log("Current email:", user?.email);

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  return {
    authorized: isAdmin(user.email),
    user,
  };
}
