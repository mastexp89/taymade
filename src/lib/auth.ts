import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@/lib/admin/roles";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me-in-prod");
export { SESSION_COOKIE };

export type Session = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Only mark Secure when actually served over HTTPS. On a plain-HTTP IP
    // deploy a Secure cookie would be dropped by the browser (can't log in).
    // Set COOKIE_SECURE=true in the env once HTTPS/a domain is in place.
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: String(payload.userId),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}
