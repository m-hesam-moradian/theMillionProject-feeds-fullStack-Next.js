"use client";
// import { useMemberStorage } from "../hooks/useMemberStorage";

import { useEffect } from "react";
import { transferLocalStorageToCookie } from "../utils/storageToCookie";

export default function LoginHandler() {
  useEffect(() => {
    const result = transferLocalStorageToCookie(["__wix.memberDetails"]);
    if (result) {
      console.log("✅ Member details found and stored in cookie:", result.id);
    } else {
      console.error("❌ __wix.memberDetails not found in localStorage");
      // Handle fallback: redirect, show login, or trigger fetch
    }
  }, []);

  return <></>;
}
