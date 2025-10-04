// app/HydrateUser.tsx
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function HydrateUser({ user }: { user: any }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(setUser(user));
  }, [user]);

  return null;
}
