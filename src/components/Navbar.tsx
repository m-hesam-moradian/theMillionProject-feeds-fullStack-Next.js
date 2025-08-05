"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-around relative shadow-sm px-4">
      {/* LEFT */}
      <div className="md:hidden lg:block  ">
        <Link href="/" className="font-bold text-xl text-gray-600 ">
          <img
            className="w-auto object-cover h-14"
            loading="lazy"
            src="https://static.wixstatic.com/media/1ae563_51b9b29a44ed463b9cdfc419ecc40ac9~mv2.png/v1/crop/x_0,y_475,w_6284,h_2948/fill/w_370,h_173,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/New%20Logo.png"
            alt=""
          />
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
        {/* LINKS */}
        <div className="flex gap-6 text-gray-600">
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
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/friends.png"
              alt="Friends"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Friends</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/stories.png"
              alt="Stories"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Stories</span>
          </Link>
        </div>
        {/* get user from prisma data base and show user profile */}
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md w-[60%] relative">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent outline-none"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "search...")}
            onKeyDown={(e) => {
              // get the all data from the input
              const value = e.currentTarget.value;
              if (e.key === "Enter") {
                // Handle search action here
                console.log("Search for:", value);
              }
            }}
          />
          <Image src="/search.png" alt="" width={14} height={14} />
          {/* a float div to show searched users by profile picture and name */}
          <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-full max-h-60 overflow-y-auto">
            {/* Map through searched users and display their profile picture and name */}
            {/* <div className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer">
              <Image
                src="/noAvatar.png"
                alt="User"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">John Doe</span>
            </div> */}
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className=" flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer">
              <Image src="/people.png" alt="" width={24} height={24} />
            </div>
            <div className="cursor-pointer">
              <Image src="/messages.png" alt="" width={20} height={20} />
            </div>
            <div className="cursor-pointer">
              <Image src="/notifications.png" alt="" width={20} height={20} />
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" alt="" width={20} height={20} />
              <Link href="/sign-in">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
