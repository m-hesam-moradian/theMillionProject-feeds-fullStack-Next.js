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

  return (
    <div>
      <h1>Welcome to The Million Project</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {memberDetails ? (
        <div>
          <p>Name: {memberDetails.memberName}</p>
          <p>Email: {memberDetails.loginEmail}</p>
          <p>Status: {memberDetails.status}</p>
        </div>
      ) : (
        <p>Loading member details...</p>
      )}
    </div>
  );
}
