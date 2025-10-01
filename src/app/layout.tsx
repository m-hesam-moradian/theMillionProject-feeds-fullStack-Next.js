import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev Social Media App",
  description: "Social media app built with Next.js",
};

interface DecodedUser extends JwtPayload {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read cookie on the server
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  let user: DecodedUser | null = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    } catch (err) {
      console.error("JWT verification failed:", err);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          {/* Pass user info down to Navbar */}
          <Navbar user={user} />
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
      </body>
    </html>
  );
}
