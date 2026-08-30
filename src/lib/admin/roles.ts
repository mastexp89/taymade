export type Perm =
  | "orders"
  | "stock"
  | "enquiries"
  | "products"
  | "customers"
  | "nfc"
  | "content"
  | "staff";

export type Role = "super" | "staff";

export const ROLE_LABEL: Record<Role, string> = {
  super: "Super Admin",
  staff: "Staff",
};

// Super admin sees everything. Staff (Rachel) is scoped — this is the set the
// super admin would toggle per person in Settings → Staff.
const PERMS: Record<Role, Perm[] | "all"> = {
  super: "all",
  staff: ["orders", "stock", "enquiries"],
};

export function can(role: Role, perm: Perm): boolean {
  const p = PERMS[role];
  return p === "all" || p.includes(perm);
}
