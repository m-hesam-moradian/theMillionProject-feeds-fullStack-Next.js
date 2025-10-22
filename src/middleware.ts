import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { validateAndPostUser } from "@/lib/validateAndPostUser";

const LOGIN_URL = "https://www.themillionproject.org/";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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

  const queryUserId = url.searchParams.get("userId");
  if (queryUserId && queryUserId !== "no-user-id") {
    console.log(queryUserId);
    const user = await validateUser(queryUserId);

    if (user) {
      const payload = {
        id: user.id,
        username: user.nickname || user.memberName || user.loginEmail || "",
        avatar: user.picture?.url || "",
        role: user.role || "ADMIN",
        isSubscribed: user.isSubscribed ?? false,
      };

      await validateAndPostUser(user);
      const token = await createJWT(payload);

      const res = NextResponse.redirect(new URL("/", req.url));

      res.cookies.set("authToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 86400,
      });

      res.cookies.set("userInfo", JSON.stringify(payload), {
        path: "/",
        httpOnly: false,
        maxAge: 86400,
      });

      return res;
    }
  }

  const token = req.cookies.get("authToken");
  if (token) {
    const decoded = await verifyJWT(token.value);
    if (decoded) {
      return NextResponse.next();
    } else {
      const res = NextResponse.redirect(LOGIN_URL);
      res.cookies.delete("authToken");
      res.cookies.delete("userInfo");
      return res;
    }
  }

  if (!queryUserId && !token) {
    return NextResponse.redirect(LOGIN_URL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
