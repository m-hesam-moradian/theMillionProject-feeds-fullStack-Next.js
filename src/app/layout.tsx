import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { getUserFromJWT } from "@/lib/getUserFromJWT";
import ReduxProvider from "./ReduxProvider";
import HydrateUser from "./HydrateUser"; // ✅ import this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TheMillionProject Social Media",
  description: "Social media app",
};

//backend JWT auth usage
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function getUserFromRequest() {
//   const token = cookies().get("authToken");
//   if (!token) return null;

//   try {
//     const { payload } = await jwtVerify(token.value, JWT_SECRET);
//     return payload; // contains id, username, role, etc.
//   } catch {
//     return null;
//   }
// }
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromJWT();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <HydrateUser user={user} /> {/* ✅ hydrate Redux */}
          <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <Navbar />
          </div>
          <div className="bg-[#eff2ef] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            {children}
          </div>
          <div className="text-center h-[35px] text-gray-500 shadow-inner flex items-center justify-center">
            <span className="mr-1">Developed by</span>
            <span className="font-semibold">
              M.He<span className="text-main_third mr-1">sam</span>
              <span className="text-main_third">Moradian</span>
            </span>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
