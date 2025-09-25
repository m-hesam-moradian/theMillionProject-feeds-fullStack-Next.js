"use client";
import { useState, useEffect } from "react";

// Define the shape of memberDetails based on your object
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

// Define the hook's return type
interface MemberStorageResult {
  memberDetails: MemberDetails | null;
  error: string | null;
}

// Singleton cache to avoid multiple localStorage reads
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
      const storedData = localStorage.getItem("__wix.memberDetails");
      if (storedData) {
        const parsedData: MemberDetails = JSON.parse(storedData);
        cachedMemberDetails = parsedData;
        setMemberDetails(parsedData);
        console.log("Retrieved from localStorage:", parsedData);
      } else {
        cachedError = "No member details found in localStorage";
        setError(cachedError);
        console.log("No data in __wix.memberDetails");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      cachedError = `Failed to access localStorage: ${errorMessage}`;
      setError(cachedError);
      console.error("localStorage error:", errorMessage);
    }
  }, []);

  return { memberDetails, error };
}
