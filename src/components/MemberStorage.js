"use client";
import { useState, useEffect } from "react";

export default function MemberStorage() {
  const [memberDetails, setMemberDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("__wix.memberDetails");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setMemberDetails(parsedData);
        console.log("Retrieved from localStorage:", parsedData);
      } else {
        setError("No member details found in localStorage");
        console.log("No data in __wix.memberDetails");
      }
    } catch (e) {
      setError(`Failed to access localStorage: ${e.message}`);
      console.error("localStorage error:", e.message);
    }
  }, []);
  console.log("MemberStorage render:", { memberDetails, error });

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {memberDetails ? (
        <div>
          <h2 className="font-bold">Member Details</h2>
          <p>Name: {memberDetails.name}</p>
          <p>Email: {memberDetails.email}</p>
          <p>ID: {memberDetails.id}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
