"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // npm install js-cookie

interface MemberDetails {
  id?: string;
  contactId?: string;
  loginEmail?: string;
  imageUrl?: string;
  nickname?: string;
  profilePrivacyStatus?: "PRIVATE" | "PUBLIC" | string;
  slug?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  creationDate?: string;
  lastUpdateDate?: string;
  lastLoginDate?: string;
  emailVerified?: boolean;
  role?: "MEMBER" | "ADMIN" | string;
  owner?: boolean;
  firstName?: string;
  lastName?: string;
  memberName?: string;
  [key: string]: any;
}

interface MemberStorageResult {
  memberDetails: MemberDetails | null;
  error: string | null;
}

let cachedMemberDetails: MemberDetails | null = null;
let cachedError: string | null = null;

export function useMemberStorage(): MemberStorageResult {
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(
    cachedMemberDetails
  );
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    if (cachedMemberDetails || cachedError) {
      setMemberDetails(cachedMemberDetails);
      setError(cachedError);
      return;
    }

    try {
      const localData = localStorage.getItem("__wix.memberDetails");
      const cookieData = Cookies.get("__wix.memberDetails");

      let parsedData: MemberDetails | null = null;

      if (localData) {
        parsedData = JSON.parse(localData);
        Cookies.set("__wix.memberDetails", localData, { expires: 7 }); // sync to cookie
        console.log("Retrieved from localStorage:", parsedData);
      } else if (cookieData) {
        parsedData = JSON.parse(cookieData);
        console.log("Retrieved from cookie:", parsedData);
      }

      if (parsedData) {
        cachedMemberDetails = parsedData;
        setMemberDetails(parsedData);
      } else {
        cachedError = "No member details found in localStorage or cookies";
        setError(cachedError);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      cachedError = `Failed to access storage: ${errorMessage}`;
      setError(cachedError);
      console.error("Storage error:", errorMessage);
    }
  }, []);

  return { memberDetails, error };
}
