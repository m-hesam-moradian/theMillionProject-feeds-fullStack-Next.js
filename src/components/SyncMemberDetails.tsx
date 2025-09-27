"use client";

import { useEffect } from "react";

export default function SyncMemberDetails() {
  useEffect(() => {
    const memberDetails = localStorage.getItem("__wix.memberDetails");

    if (memberDetails) {
      document.cookie = `memberDetails=${encodeURIComponent(
        memberDetails
      )}; path=/; SameSite=Lax;`;
    }
  }, []);

  return null;
}

// // @@@@@@@@@@@@@@@@@@@@ example usage on server side @@@@@@@@@@@@@@@@@@@@
// import { cookies } from "next/headers";

// export function getMemberDetails() {
//   const cookieStore = cookies();
//   const raw = cookieStore.get("memberDetails")?.value;

//   if (!raw) return null;

// try {
//   return JSON.parse(decodeURIComponent(raw));
// } catch {
//   return null;
// }
// }
// const Feed = async () => {
//   const member = getMemberDetails();

//   return (
//     <div>
//       <h1>Welcome {member?.firstName}</h1>
//       <p>Your ID: {member?.id}</p>
//     </div>
//   );
// };
