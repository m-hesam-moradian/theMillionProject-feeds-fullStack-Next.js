"use client";

import { useState } from "react";
import Image from "next/image";

export default function SearchBar() {
  // const [query, setQuery] = useState("");
  // const [results, setResults] = useState([]);

  // const handleSearch = async () => {
  //   if (!query.trim()) return;

  //   try {
  //     const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
  //     console.log(res);

  //     const data = await res.json();
  //     setResults(data);
  //   } catch (err) {
  //     console.error("Failed to fetch users:", err);
  //   }
  // };

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md w-[60%] relative">
      {/* <input
        type="text"
        placeholder="search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent outline-none"
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "search...")}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Image src="/search.png" alt="" width={14} height={14} />

      {results.length > 0 && (
        <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-full max-h-60 overflow-y-auto">
          {results.map((user: any, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={user.avatar || "/noAvatar.png"}
                alt={user.username}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.name || user.username}</span>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
