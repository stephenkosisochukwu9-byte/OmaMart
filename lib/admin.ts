export const ADMIN_EMAIL = "stephenkosisochukwu9@gmail.com";

export function isAdmin(email: string | undefined | null) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
