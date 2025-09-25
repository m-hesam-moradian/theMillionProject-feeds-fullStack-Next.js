"use client";
import { useMemberStorage } from "../hooks/useMemberStorage";
import { ReactNode } from "react";

// Define the shape of memberDetails
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

// Define props for the wrapper
interface ClientMemberWrapperProps {
  children: (props: { memberDetails: MemberDetails }) => ReactNode;
}

export default function ClientMemberWrapper({
  children,
}: ClientMemberWrapperProps) {
  const { memberDetails, error } = useMemberStorage();

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!memberDetails)
    return <div className="text-gray-500 p-4">Loading user data...</div>;

  // Explicitly invoke the render prop function
  return children({ memberDetails });
}
