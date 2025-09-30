// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createJWT, verifyJWT } from "@/lib/jwt";
// import { validateAndPostUser } from "@/lib/validateAndPostUser";

// export default async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const userId = url.searchParams.get("userId");

//   // if we have ?userId in query
//   if (userId && userId !== "no-user-id") {
//     try {
//       const res = await fetch(
//         `https://www.themillionproject.org/_functions/userById?userId=${encodeURIComponent(
//           userId
//         )}`
//       );
//       const data = await res.json();

//       if (data.success && data.user) {
//         await validateAndPostUser(data.user);

//         const token = await createJWT({ id: data.user.id });
//         const response = NextResponse.next();

//         response.cookies.set(
//           "UserInfo",
//           encodeURIComponent(JSON.stringify(data.user)),
//           { path: "/", maxAge: 60 * 60 * 24 }
//         );
//         response.cookies.set("AuthToken", token, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//         });

//         return response;
//       }
//     } catch (err) {
//       console.error("❌ Wix fetch failed:", err);
//       return NextResponse.redirect("https://www.themillionproject.org/");
//     }
//   }

//   // if no query, check AuthToken
//   const token = req.cookies.get("AuthToken")?.value;
//   if (token) {
//     const valid = await verifyJWT(token);
//     if (valid) return NextResponse.next();
//   }

//   // fallback
//   return NextResponse.redirect("https://www.themillionproject.org/");
// }

// export const config = {
//   matcher: ["/feed/:path*", "/settings/:path*"], // only protect these
// };
