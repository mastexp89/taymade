import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  active: boolean;
};

export async function listStaff(): Promise<StaffRow[]> {
  const rows = await prisma.staffUser.findMany({ orderBy: [{ isSuperAdmin: "desc" }, { createdAt: "asc" }] });
  return rows.map((u) => ({
    id: u.id,
    name: u.name ?? "Staff",
    email: u.email,
    isSuperAdmin: u.isSuperAdmin,
    active: u.active,
  }));
}

export async function createStaff(input: {
  name: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.toLowerCase().trim();
  if (!input.name.trim() || !email || input.password.length < 8) {
    return { ok: false, error: "Name, a valid email and a password of 8+ characters are required." };
  }
  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "A staff member with that email already exists." };
  await prisma.staffUser.create({
    data: {
      name: input.name.trim(),
      email,
      isSuperAdmin: input.isSuperAdmin,
      passwordHash: await bcrypt.hash(input.password, 10),
    },
  });
  return { ok: true };
}

export async function setStaffPassword(id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  await prisma.staffUser.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  return { ok: true };
}

export async function setStaffActive(id: string, active: boolean) {
  await prisma.staffUser.update({ where: { id }, data: { active } });
}

export async function changeOwnPassword(
  userId: string,
  current: string,
  next: string,
): Promise<{ ok: boolean; error?: string }> {
  if (next.length < 8) return { ok: false, error: "Your new password must be at least 8 characters." };
  const user = await prisma.staffUser.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false, error: "Your current password isn't right." };
  }
  await prisma.staffUser.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}
