// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAndPostUser } from "@/lib/validateAndPostUser";

const LOGIN_URL = "https://www.themillionproject.org/";

async function validateUser(userId: string): Promise<any | null> {
  try {
    const res = await fetch(
      `https://www.themillionproject.org/_functions/userById?userId=${encodeURIComponent(
        userId
      )}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    if (data.success && data.user) {
      return data.user;
    }
    return null;
  } catch (err) {
    console.error("Validation error:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Query param first
  const queryUserId = url.searchParams.get("userId");
  if (queryUserId && queryUserId !== "no-user-id") {
    const user = await validateUser(queryUserId);
    if (user) {
      await validateAndPostUser(user); // ✅ loginSync inline
      const res = NextResponse.next();
      res.cookies.set("UserInfo", JSON.stringify(user), {
        path: "/",
        maxAge: 86400,
      });
      return res;
    }
  }

  // 2. Cookie fallback
  const cookieUser = req.cookies.get("UserInfo");
  if (cookieUser) {
    try {
      const parsed = JSON.parse(cookieUser.value);
      if (parsed?.id) {
        const user = await validateUser(parsed.id);
        if (user) {
          await validateAndPostUser(user); // ✅ loginSync inline
          const res = NextResponse.next();
          res.cookies.set("UserInfo", JSON.stringify(user), {
            path: "/",
            maxAge: 86400,
          });
          return res;
        }
      }
    } catch (err) {
      console.error("Cookie parse error:", err);
    }
  }

  // 3. Otherwise → redirect
  url.href = LOGIN_URL;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
