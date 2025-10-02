"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { jwtDecode } from "jwt-decode";

export default function UserLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) return;

    try {
      const payload = jwtDecode(token);
      dispatch(setUser(payload as any));
      console.log("User loaded from JWT:", payload);
    } catch (err) {
      console.error("JWT decode failed:", err);
    }
  }, [dispatch]);

  return null;
}
