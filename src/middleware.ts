// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { validateAndPostUser } from "@/lib/validateAndPostUser";

const LOGIN_URL = "https://www.themillionproject.org/";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
);

async function createJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(JWT_SECRET);
}

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

async function validateUser(userId: string): Promise<any | null> {
  try {
    const res = await fetch(
      `https://www.themillionproject.org/_functions/userById?userId=${encodeURIComponent(
        userId
      )}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    if (data.success && data.user) return data.user;
    return null;
  } catch (err) {
    console.error("Validation error:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. First-time login with query param
  const queryUserId = url.searchParams.get("userId");
  if (queryUserId && queryUserId !== "no-user-id") {
    const user = await validateUser(queryUserId);
    if (user) {
      // Build payload
      const payload = {
        id: user.id,
        username: user.nickname || user.memberName || user.loginEmail || "",
        avatar: user.picture?.url || "",
        role: user.role || "USER",
        isSubscribed: user.isSubscribed ?? false,
      };

      // Save user in Wix
      await validateAndPostUser(user);

      // Create JWT
      const token = await createJWT(payload);

      // Set JWT cookie
      const res = NextResponse.next();
      res.cookies.set("authToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 86400,
      });
      return res;
    }
  }

  // 2. Check JWT cookie on next visits
  const token = req.cookies.get("authToken");
  if (token) {
    const decoded = await verifyJWT(token.value);
    if (decoded) {
      // ✅ valid JWT → continue
      return NextResponse.next();
    } else {
      // ❌ invalid JWT → clear & redirect
      const res = NextResponse.redirect(LOGIN_URL);
      res.cookies.delete("authToken");
      return res;
    }
  }

  // 3. Otherwise → redirect
  url.href = LOGIN_URL;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"], // all routes
};
