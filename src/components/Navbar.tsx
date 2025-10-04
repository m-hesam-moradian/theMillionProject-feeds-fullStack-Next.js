"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// interface User {
//   id: string;
//   username: string;
//   email?: string;
//   avatar?: string;
//   name?: string;
// }

// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";

const Navbar = () => {
  const user = useSelector((state: any) => state.user);
  // const user = { id: "21", username: "sam" };
  // const user = useSelector((state: RootState) => state.user);
  // console.log("User ID:", user.id);
  // console.log("Username:", user.username);

  const [value, setValue] = useState<string>("");

  const [isSearchbarOpen, setIsSearchbarOpen] = useState<boolean>(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!value || value.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${value}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <div className="h-24 flex items-center justify-around relative shadow-sm px-4">
      {/* LEFT */}
      <div className="hidden lg:block">
        <Link href="/" className="font-bold text-xl text-gray-600">
          <img
            className="w-auto object-cover h-14"
            loading="lazy"
            src="https://static.wixstatic.com/media/1ae563_51b9b29a44ed463b9cdfc419ecc40ac9~mv2.png/v1/crop/x_0,y_475,w_6284,h_2948/fill/w_370,h_173,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/New%20Logo.png"
            alt="Logo"
          />
        </Link>
      </div>

      {/* CENTER */}
      <div className="  w-[50%] text-sm items-center justify-between ">
        <div className="hidden md:flex gap-6 text-gray-600">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Homepage</span>
          </Link>
        </div>

        {/* SEARCHBAR */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search By ID..."
            className="bg-transparent outline-none w-full"
            onFocus={(e) => {
              e.target.placeholder = "";
              setIsSearchbarOpen(true);
            }}
            onBlur={(e) => {
              e.target.placeholder = "Search By ID...";
              setTimeout(() => setIsSearchbarOpen(false), 500);
            }}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Image src="/search.png" alt="Search" width={14} height={14} />
          {isSearchbarOpen && (
            <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-full max-h-60 overflow-y-auto z-50">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={user.avatar || "/noAvatar.png"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {user.name || user.username}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* MOBILE SEARCH ICON */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsSearchbarOpen(!isSearchbarOpen)}>
            <Image src="/search.png" alt="Search" width={20} height={20} />
          </button>
        </div>

        {/* MOBILE SEARCH INPUT */}
        {isSearchbarOpen && (
          <div className="absolute top-20 left-0 w-full px-4 md:hidden z-50">
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <input
                type="text"
                placeholder="Search By ID..."
                className="bg-transparent outline-none w-full"
                onChange={(e) => setValue(e.currentTarget.value)}
              />
              <Image src="/search.png" alt="Search" width={14} height={14} />
            </div>
            <div className="bg-white shadow-md rounded-md w-full max-h-60 overflow-y-auto mt-2">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={user.avatar || "/noAvatar.png"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {user.name || user.username}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 xl:gap-8 justify-end">
        <div className="hidden md:flex cursor-pointer">
          <Image src="/people.png" alt="" width={24} height={24} />
        </div>
        <div className="hidden md:flex cursor-pointer">
          <Image src="/messages.png" alt="" width={20} height={20} />
        </div>
        <div className="hidden md:flex cursor-pointer">
          <Image src="/notifications.png" alt="" width={20} height={20} />
        </div>

        {/* USER INFO FROM JWT */}
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src={user.avatar || "/noAvatar.png"}
              alt="User Avatar"
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="font-medium">{user.username}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Image src="/login.png" alt="" width={20} height={20} />
            <Link href="https://www.themillionproject.org/">
              Login/Register
            </Link>
          </div>
        )}

        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
