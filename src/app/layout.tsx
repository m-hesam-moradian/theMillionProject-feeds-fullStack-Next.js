import { Inter } from "next/font/google";
import { CustomAuthProvider } from "@/components/CustomAuthProvider";
import Navbar from "@/components/Navbar"; // Adjust import path

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomAuthProvider>
      <html lang="en">
        <body className={inter.className}>
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
        </body>
      </html>
    </CustomAuthProvider>
  );
}
