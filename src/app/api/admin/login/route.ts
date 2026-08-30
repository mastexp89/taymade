import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = body.email?.toLowerCase().trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return Response.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const user = await prisma.staffUser.findUnique({ where: { email } });
  if (!user || !user.active || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return Response.json({ error: "Wrong email or password." }, { status: 401 });
  }

  await createSession({
    userId: user.id,
    name: user.name ?? "Staff",
    email: user.email,
    role: user.isSuperAdmin ? "super" : "staff",
  });
  return Response.json({ ok: true });
}
